import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useMemo, useRef, useState, type FC } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ListRenderItem,
  Pressable,
} from "react-native";
import { s, scale } from "react-native-size-matters";

import {
  BottomSheet,
  BottomSheetRef,
  Box,
  ScreenBox,
  Text,
  TextInput,
} from "@/components";
import { useAuth } from "@/contexts/auth";
import { useOverlayLoader } from "@/contexts/overlay_loader";
import { queryClient, QueryKeys } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Toast } from "@/lib/toast";
import {
  createStyleHook,
  formatCurrency,
  getElectricityProviderLogoFromText,
  requestAppStoreReview,
} from "@/lib/utils";
import { FontName } from "@/theme";
import { router } from "expo-router";
import { getMeterInfo as fetchMeterInfo, topUpElectricity } from "./api";
import {
  BeneficiaryButton,
  ProviderSelectButton,
  ProviderSheet,
} from "./components";
import { CheckSelectButton } from "./components/CheckSelectButton";
import {
  useGetElectricityProviders,
  useGetServiceCharge,
  useSavedBeneficiaries,
} from "./hooks";
import { electricityTopupSchema } from "./schema";
import { txDetailRef } from "./tx_detail_ref";
import {
  ElectricityTopupFormData,
  IMeterInfo,
  SavedBeneficiary,
} from "./types";
import {
  balanceSufficient,
  isServiceError,
  isSeverError,
  isTxPending,
  isTxSuccessful,
  isValidationError,
} from "./utils";

// TODO: create custom bottom sheet component that overlays screen headers and use here
let meterInfoRequestController = new AbortController();

const PREFILL_AMOUNTS = [
  1000, 2000, 3000, 4000, 5000, 7000, 10000, 20000, 30000, 50000,
];

interface ElectricityScreenProps {}
type MeterInfoState = { verifying: boolean; info: IMeterInfo | null };

/**
 * Component for `Electricity` screen
 */
export const ElectricityScreen: FC<ElectricityScreenProps> = (props) => {
  const providerSheetRef = useRef<BottomSheetRef>(null);
  const beneficiariesSheetRef = useRef<BottomSheetRef>(null);
  const [meterInfo, setMeterInfo] = useState<MeterInfoState>({
    verifying: false,
    info: null,
  });

  const serviceChargeQuery = useGetServiceCharge();
  const providers = useGetElectricityProviders();
  const { beneficiaries, deleteBeneficiary, saveBeneficiary } =
    useSavedBeneficiaries();

  const { styles, colors, insets, spacing, palette } = useStyles();
  const loader = useOverlayLoader();
  const { user, syncProfile } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    setError,
    clearErrors,
    setFocus,
  } = useForm<ElectricityTopupFormData>({
    resolver: zodResolver(electricityTopupSchema),
    mode: "onSubmit",
    defaultValues: { meterType: "prepaid" },
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const { amount } = useWatch({
    control,
  });

  const sheetProps = useMemo(
    () => ({
      ref: providerSheetRef,
      snapPoints: ["50%", "70%"],
      index: -1,
      enableDynamicSizing: false,
    }),
    []
  );

  const renderBeneficiary = useCallback<ListRenderItem<SavedBeneficiary>>(
    ({ item: beneficiary }) => (
      <BeneficiaryButton
        key={beneficiary.id}
        beneficiary={beneficiary}
        onDelete={() => {
          deleteBeneficiary(beneficiary.id);
        }}
        onSelect={() => {
          const name = beneficiary.provider.name;
          reset(
            {
              meterNumber: beneficiary.meterNo,
              meterType: beneficiary.meterType,
              provider: {
                logo: getElectricityProviderLogoFromText(name),
                name,
                serviceId: beneficiary.provider.service_id,
              },
            },
            { keepTouched: true }
          );
          getMeterInfo(beneficiary.meterNo);
          beneficiariesSheetRef.current?.close();
        }}
      />
    ),
    [beneficiaries]
  );

  const renderNoBeneficiaryView = useCallback(() => {
    return (
      <Box alignItems={"center"} justifyContent={"center"} mt={"xl"}>
        <Text fontFamily={"PrimaryBold"}>No saved beneficiaries yet!</Text>
        <Text variant={"small"}>
          You can add/save a new beneficiary after you top-up
        </Text>
      </Box>
    );
  }, []);

  const deductBalance = (amount: string, serviceCharge: string) => {
    // @ts-expect-error
    syncProfile({
      balance: (
        +(user?.profile.balance || "0") -
        (+(amount || "0") + +(serviceCharge || "0"))
      ).toString(),
    });
  };

  const handleSubmitForm = handleSubmit(async (formData) => {
    // ensure service charge data is at least fetched
    if (!serviceChargeQuery.data) return;
    // ensure meter details are verified before allowing recharge
    if (!meterInfo.info) return getMeterInfo(formData.meterNumber);

    // check wallet balance before allowing recharge
    const balSufficient = balanceSufficient(
      user,
      formData.amount,
      serviceChargeQuery.data
    );
    if (!balSufficient)
      return Toast.error(
        "Insufficient balance for transaction. Tap here to top-up your wallet and continue",
        {
          text1: "Balance Insufficient",
          onPress() {
            router.navigate("/(protected)/wallet/add_money");
          },
          visibilityTime: 7000,
        }
      );

    // all good, let's attempt recharge
    try {
      loader.show("Topping up...Please wait");
      const data = await topUpElectricity({
        amount: formData.amount,
        billers_code: formData.meterNumber,
        phone: formData.phone || "",
        service_id: formData.provider.serviceId,
        variation_code: formData.meterType,
      });

      /**
       * Check that tx is not empty
       */
      if (!data.response?.code) throw Error("Top-up failed, please try again");

      /**
       * populate data with customer info cus it's not returned from BE
       */
      // TODO: find a better approach to fetching customer info
      const customerInfo = meterInfo.info?.content;
      const response = data.response;
      if (customerInfo) {
        data.response.customerName =
          customerInfo.Customer_Name || response.customerName;
        data.response.customerAddress =
          customerInfo.Address || response.customerAddress;
      }

      // Check success
      const isSuccess = isTxSuccessful(data);
      if (isSuccess) {
        deductBalance(formData.amount, serviceChargeQuery.data);
        const completeTopup = () => {
          // successfully recharged, pass tx to details screen for viewing and sharing
          loader.hide();
          Toast.success("Electricity top-up successful");
          requestAppStoreReview();
          txDetailRef.details = data; // temp store tx details

          router.replace("/(protected)/electricity/tx_details");
        };

        // Prompt to save as beneficiary
        const newBeneficiary: Omit<SavedBeneficiary, "id"> = {
          meterName: meterInfo.info?.content.Customer_Name!,
          meterNo: formData.meterNumber,
          meterType: formData.meterType,
          provider: {
            name: formData.provider.name,
            service_id: formData.provider.serviceId,
          },
        };

        // check if a beneficiary exists with same data
        // so we don't prompt again.
        // TODO: devise a better approach
        const beneficiaryExists = beneficiaries?.some(
          ({ id, ...rest }) =>
            JSON.stringify(rest) === JSON.stringify(newBeneficiary)
        );

        if (!beneficiaryExists) {
          Alert.alert(
            "Save Beneficiary?",
            "Do you want to save this beneficiary for easier top-up on your next recharge?",
            [
              { style: "cancel", text: "No", onPress: completeTopup },
              {
                style: "default",
                isPreferred: true,
                text: "Yes",
                onPress: () => {
                  Toast.success("Beneficiary saved successfully", {
                    position: "top",
                  });
                  saveBeneficiary({
                    ...newBeneficiary,
                    id: `beneficiary-${Date.now()}`,
                  });
                  completeTopup();
                },
              },
            ]
          );
        } else {
          completeTopup();
        }
        return;
      }

      /**
       * check pending. For pending tx, we still redirect to tx screen
       * and show pending status and intervally requery tx status while they're on that screen.
       * Token would be sent to their number if tx fulfils
       * then when they revisit the transaction from their tx history
       * we requery the tx status from service provider.
       */
      const isPending = isTxPending(data);
      if (isPending) {
        deductBalance(formData.amount, serviceChargeQuery.data);
        loader.hide();
        Toast.success("Electricity top-up initiated");
        txDetailRef.details = data; // temp store tx details
        router.replace("/(protected)/electricity/tx_details");
        return;
      }

      /**
       * Check that tx failed due to third party service provider or biller error
       */
      const is3rdPartyError = isServiceError(data);
      if (is3rdPartyError) {
        loader.hide();
        Toast.error(
          "This service is unavailable at the moment, please try again in a bit"
        );
        return;
      }

      /**
       * Check that tx failed due to our server error or validation error
       * in which case we keep a log of it
       */
      const isServerOrValidationError =
        isSeverError(data) || isValidationError(data);
      if (isServerOrValidationError) {
        loader.hide();
        Toast.error(
          "Something went wrong on our end, please check back in a bit"
        );
        logger.error(
          "ElectrictyScreen::Top-up failed due to server or validation error",
          { data }
        );
        return;
      }

      const isDuplicateError = data.response?.code === "019";
      if (isDuplicateError) {
        loader.hide();
        Toast.error(
          "Likely a duplicate transaction. You tried to top-up same meter multiple times in a short time",
          { visibilityTime: 10000 }
        );
        return;
      }

      logger.error(
        "ElectricityScreen:: Transaction failed or status wasn't detected",
        {
          data,
        }
      );
      throw Error("Top-up failed, please try again");
    } catch (error: any) {
      logger.error(`ElectricityScreen:: Top-up api request threw`, { error });
      loader.hide();
      Toast.error(error.message);
    } finally {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.getElectricityTxs,
      });
    }
  });

  const getMeterInfo = async (meterNo: string) => {
    // TODO: adjust to only make request when there's no meterNo error
    meterInfoRequestController.abort();
    meterInfoRequestController = new AbortController();

    const provider = getValues("provider");
    const meterType = getValues("meterType");
    if (!provider?.serviceId || !meterType || !meterNo?.trim()) return;

    setMeterInfo({ info: null, verifying: true });

    try {
      const data = await fetchMeterInfo(
        {
          billers_code: meterNo,
          service_id: provider.serviceId,
          type: meterType,
        },
        { signal: meterInfoRequestController.signal }
      );

      // log for invalid product i.e service-id
      if (data.code === "012") {
        logger.error(
          "ElectricityScreen::Invalid serviceId used for validation",
          { data }
        );
        throw Error("An error occured, please try again");
      }

      if (
        data.code != "000" ||
        data.content?.WrongBillersCode ||
        !data.content?.Customer_Name
      )
        throw Error("Meter verification failed");

      // Auto switch to correct meter type based on meter info
      const apiMeterType = data.content?.Meter_Type;
      setValue(
        "meterType",
        apiMeterType === "PREPAID" ? "prepaid" : "postpaid"
      );

      setMeterInfo({
        verifying: false,
        info: data,
      });

      clearErrors("meterNumber");
    } catch (error) {
      setError("meterNumber", {
        message: "Invalid meter number",
      });
      setMeterInfo({ info: null, verifying: false });
    }
  };

  const goToHistory = () => {
    router.navigate("/(protected)/electricity/tx_history");
  };

  const serviceChargeInCur = formatCurrency(+(serviceChargeQuery.data || 0));
  const getTotal = (amt: number | string) =>
    formatCurrency(+amt + +(serviceChargeQuery.data || 0));

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={insets.bottom * 2}
      >
        <ScreenBox inSafeArea={false} rg={"l"}>
          <Box
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Text variant={"heading"}>Electricity{"\n"}Top Up</Text>
            {/* History */}
            <Pressable onPress={() => goToHistory()}>
              <Box
                flexDirection={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                backgroundColor={"surface"}
                p={"xs"}
                px={"s"}
                borderRadius={"s"}
              >
                <Text variant={"small"} color={"primary"}>
                  Topup History
                </Text>
                <Box pt={"xxs"}>
                  <Ionicons
                    name="chevron-forward"
                    size={scale(16)}
                    color={colors.primary}
                  />
                </Box>
              </Box>
            </Pressable>
          </Box>

          {/* Service Provider & Meter Type */}
          <Box variant={"surface"} rg={"s"}>
            <Text variant={"body"} fontFamily={"PrimaryBold"}>
              Service Provider
            </Text>
            <Controller
              control={control}
              name="provider"
              render={({
                field: { value: selectedProvider },
                fieldState: { error },
              }) => (
                <Box>
                  <ProviderSelectButton
                    onPress={() => {
                      providerSheetRef.current?.expand();
                    }}
                    provider={selectedProvider?.name || "Select Provider"}
                    logo={selectedProvider?.logo}
                  />
                  {error?.message ? (
                    <Text variant={"small"} color={"error"}>
                      {error?.message}
                    </Text>
                  ) : null}
                </Box>
              )}
            />

            {/* Meter Type */}
            <Controller
              name="meterType"
              control={control}
              render={({ field: { value } }) => (
                <Box flexDirection={"row"} cg={"s"}>
                  <CheckSelectButton
                    label="Prepaid"
                    selected={value === "prepaid"}
                    onPress={() => {
                      setValue("meterType", "prepaid");
                    }}
                  />
                  <CheckSelectButton
                    label="Postpaid"
                    selected={value === "postpaid"}
                    onPress={() => {
                      setValue("meterType", "postpaid");
                    }}
                  />
                </Box>
              )}
            />
          </Box>

          {/* Meter Number */}
          <Box variant={"surface"} rg={"s"}>
            <Box
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text variant={"body"} fontFamily={"PrimaryBold"}>
                Meter Number
              </Text>
              {beneficiaries?.length ? (
                <Pressable
                  onPress={(_) => beneficiariesSheetRef.current?.snapToIndex(0)}
                >
                  <Box
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    alignSelf={"flex-end"}
                  >
                    <Text variant={"small"} color={"primary"}>
                      Beneficiaries
                    </Text>
                    <Box pt={"xxs"}>
                      <Ionicons
                        name="chevron-forward"
                        size={scale(16)}
                        color={colors.primary}
                      />
                    </Box>
                  </Box>
                </Pressable>
              ) : null}
            </Box>

            {/* Meter Number */}
            <Controller
              name="meterNumber"
              control={control}
              render={({
                field: { value, onChange, ref },
                fieldState: { error },
              }) => (
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Enter Meter Number"
                  value={value}
                  ref={ref}
                  onChangeText={onChange}
                  onBlur={() => {
                    if (value) {
                      clearErrors("meterNumber");
                      getMeterInfo(value);
                    }
                  }}
                  onSubmitEditing={() => setFocus("phone")}
                  error={error?.message}
                  style={[
                    styles.meterNoInput,
                    value?.trim?.() && {
                      fontWeight: "900",
                      letterSpacing: s(2),
                      fontFamily: FontName.PrimaryBlack,
                    },
                  ]}
                />
              )}
            />
            {meterInfo.verifying || meterInfo.info ? (
              <Box
                flexDirection={"row"}
                alignItems={"center"}
                cg={"xxs"}
                p={"xs"}
                borderRadius={"s"}
                backgroundColor={"background"}
              >
                {meterInfo.verifying ? (
                  <Box flexDirection={"row"} cg={"xxs"} alignItems={"center"}>
                    <ActivityIndicator color={colors.primary} size={"small"} />
                    <Text variant={"small"} fontFamily={"PrimaryBold"}>
                      Verifying meter number
                    </Text>
                  </Box>
                ) : (
                  <>
                    <AntDesign
                      size={s(13)}
                      name="checkcircle"
                      color={colors.primary}
                    />
                    <Text
                      style={{ fontSize: s(11) }}
                      variant={"small"}
                      ml={"xs"}
                      fontFamily={"PrimaryBold"}
                    >
                      {meterInfo.info?.content?.Customer_Name}
                      {" - "}
                      {meterInfo.info?.content?.Address}
                    </Text>
                  </>
                )}
              </Box>
            ) : null}
          </Box>

          {/* Phone Number */}
          <Box variant={"surface"} rg={"s"}>
            <Text variant={"body"} fontFamily={"PrimaryBold"}>
              Phone Number
            </Text>
            <Controller
              name="phone"
              control={control}
              render={({
                field: { value, onChange, ref },
                fieldState: { error },
              }) => (
                <TextInput
                  keyboardType="number-pad"
                  placeholder="Enter Phone Number"
                  value={value}
                  ref={ref}
                  onSubmitEditing={() => setFocus("amount")}
                  onChangeText={onChange}
                  error={error?.message}
                  style={styles.meterNoInput}
                />
              )}
            />
          </Box>

          {/* Amount */}
          <Box variant={"surface"} rg={"s"}>
            <Text variant={"body"} fontFamily={"PrimaryBold"}>
              Select Amount
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({
                field: { value, onChange, ref },
                fieldState: { error },
              }) => (
                <Box>
                  <Box flexDirection={"row"} alignItems={"center"} cg={"xs"}>
                    <Box
                      flexDirection={"row"}
                      alignItems={"center"}
                      borderWidth={1}
                      borderRadius={"m"}
                      pl={"m"}
                      flex={1}
                      style={{ borderColor: colors.border }}
                    >
                      <Text
                        fontFamily={"PrimaryBold"}
                        onPress={() => setFocus("amount")}
                      >
                        {"\u20A6"}
                      </Text>
                      <TextInput
                        keyboardType="number-pad"
                        placeholder="Amount"
                        ref={ref}
                        value={value?.toString()}
                        onChangeText={onChange}
                        style={{
                          borderWidth: 0,
                          flex: 1,
                        }}
                      />
                    </Box>
                    <Pressable
                      onPress={() => {
                        handleSubmitForm();
                      }}
                      style={[styles.payBtn, { opacity: value ? 1.0 : 0.5 }]}
                      disabled={!value || !serviceChargeQuery.data}
                    >
                      <Text color={"primaryText"} fontFamily={"PrimaryBold"}>
                        TOP UP
                      </Text>
                    </Pressable>
                  </Box>
                  {error?.message ? (
                    <Text variant={"small"} color={"error"}>
                      {error?.message}
                    </Text>
                  ) : null}
                </Box>
              )}
            />

            {/* Total */}
            {amount ? (
              <Box
                flexDirection={"row"}
                bg={"background"}
                alignItems={"center"}
                justifyContent={"space-between"}
                borderRadius={"xs"}
                p={"xs"}
                cg={"xxs"}
              >
                <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
                  <Text variant={"small"} numberOfLines={3}>
                    Total: {formatCurrency(+amount || 0)} + {serviceChargeInCur}{" "}
                    =
                    <Text variant={"small"} fontFamily={"PrimaryBold"}>
                      {" "}
                      {getTotal(+amount || 0)}
                    </Text>
                  </Text>
                </Box>
              </Box>
            ) : null}

            {/* Fees */}
            <Box backgroundColor={"background"} p="xs" borderRadius={"xs"}>
              <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
                <Ionicons
                  name="information-circle-sharp"
                  size={s(14)}
                  color={colors.warning}
                />
                <Text variant={"small"} fontFamily={"PrimaryBold"}>
                  Fees
                </Text>
              </Box>

              {/* Service Charge */}
              {serviceChargeQuery.isLoading ? (
                <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
                  <ActivityIndicator
                    style={{ alignSelf: "flex-start" }}
                    color={colors.primary}
                    size={"small"}
                  />
                  <Text variant={"small"} color={"textMuted"}>
                    Loading...
                  </Text>
                </Box>
              ) : serviceChargeQuery.data ? (
                <Box>
                  <Box flexDirection={"row"} alignItems={"center"} cg={"xxs"}>
                    <Text variant={"small"} fontStyle={"italic"}>
                      Service Fee:
                    </Text>
                    <Text variant={"small"} fontStyle={"italic"}>
                      {serviceChargeInCur}
                    </Text>
                  </Box>
                </Box>
              ) : null}
            </Box>

            {/* Amount prefill buttons */}
            <Box
              flexDirection={"row"}
              flexWrap={"wrap"}
              alignItems={"center"}
              alignContent={"center"}
              g={"xs"}
              mt={"s"}
            >
              {PREFILL_AMOUNTS.map((amount) => (
                <Pressable
                  key={amount}
                  disabled={!serviceChargeQuery.data}
                  onPress={(e) => {
                    setValue("amount", amount.toString());
                    handleSubmitForm();
                  }}
                  style={styles.prefilAmtBtn}
                >
                  <Box
                    minWidth={s(90)}
                    bg={"primary"}
                    padding={"xs"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    borderRadius={"s"}
                  >
                    <Text
                      fontFamily={"PrimaryBold"}
                      color={"primaryText"}
                      variant={"small"}
                    >
                      {formatCurrency(amount, { maximumFractionDigits: 0 })}
                    </Text>
                    {serviceChargeQuery.data ? (
                      <Text
                        variant={"caption"}
                        fontFamily={"PrimaryBold"}
                        style={{ fontSize: s(10), color: palette.white600 }}
                      >
                        Pay {getTotal(+amount || 0)}
                      </Text>
                    ) : null}
                  </Box>
                </Pressable>
              ))}
            </Box>
          </Box>
        </ScreenBox>
      </KeyboardAvoidingView>

      <ProviderSheet
        {...sheetProps}
        query={providers}
        onProviderSelect={(selected) => {
          setValue(
            "provider",
            {
              logo: selected.logo.toString(),
              name: selected.name,
              serviceId: selected.service_id,
            },
            { shouldValidate: true }
          );
          setValue("meterNumber", "", {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          setMeterInfo({ info: null, verifying: false });
          providerSheetRef.current?.close();
          setFocus("meterNumber");
        }}
      />
      <BottomSheet
        enablePanDownToClose
        {...sheetProps}
        ref={beneficiariesSheetRef}
      >
        <Box>
          <Text variant={"heading3"} textAlign={"center"} mt={"s"}>
            Beneficiaries
          </Text>
          <Text
            variant={"small"}
            color={"textMuted"}
            textAlign={"center"}
            mb={"s"}
          >
            Select a beneficiary to top-up for
          </Text>
        </Box>
        <BottomSheetFlatList
          data={beneficiaries || []}
          ListEmptyComponent={renderNoBeneficiaryView}
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            paddingTop: spacing.xs,
            rowGap: spacing.m,
          }}
          keyExtractor={(i) =>
            `${i.meterName}-${i.provider.service_id}-${i.meterNo}`
          }
          renderItem={renderBeneficiary}
        />
      </BottomSheet>
    </>
  );
};

ElectricityScreen.displayName = "ElectricityScreen";

const useStyles = createStyleHook(
  ({ colors, spacing, borderRadii, isDarkMode, palette }) => ({
    payBtn: {
      backgroundColor: colors.primary,
      padding: spacing.s,
      paddingHorizontal: spacing.xl,
      borderRadius: spacing.xxs,
    },
    meterNoInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? palette.gray900 : palette.gray100,
    },
    providerSheetStyle: {
      padding: spacing.m,
      backgroundColor: colors.surface,
      borderTopLeftRadius: borderRadii.xl,
      borderTopRightRadius: borderRadii.xl,
    },
    prefilAmtBtn: {
      borderRadius: borderRadii.s,
    },
  })
);
