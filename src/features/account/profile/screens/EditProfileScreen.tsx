import { SimpleLineIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable } from "react-native";
import { s } from "react-native-size-matters";

import { Box, Button, Image, ScreenBox, TextInput } from "@/components";
import { useAuth } from "@/contexts/auth";
import { PROFILE_PIC_BASE_URL } from "@/lib/constants";
import { Toast } from "@/lib/toast";
import { createStyleHook } from "@/lib/utils";
import { Images } from "@assets/index";
import { updateProfile } from "../api";
import { editProfileSchema } from "../schema";
import { EditProfileFormData } from "../types";

interface EditProfileScreenProps {}

/**
 * Component for `EditProfile` screen
 */
export const EditProfileScreen: FC<EditProfileScreenProps> = (props) => {
  const { palette, styles } = useStyles();
  const { user, syncProfile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [uploadedPic, setUploadedPic] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >();
  const { control, handleSubmit } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onSubmit",
    defaultValues: {
      name: user?.profile.name,
      phone: user?.profile.phone,
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      selectionLimit: 1,
      preferredAssetRepresentationMode:
        ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      allowsMultipleSelection: false,
      base64: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setUploadedPic(asset);
    }
  };

  const handleUpdate = handleSubmit(async (data) => {
    try {
      setUpdating(true);
      const profile = await updateProfile({
        name: data.name,
        phone: data.phone,
        profilePic: uploadedPic,
      });
      Toast.success("Profile updated successfulyy");
      syncProfile(profile);
    } catch (error) {
      console.log(error);
      Toast.error("Failed to update profile, please try again");
    } finally {
      setUpdating(false);
    }
  });

  const userProfilePic = `${PROFILE_PIC_BASE_URL}/${user?.profile.profile}`;

  return (
    <ScreenBox rg={"xxl"}>
      <Pressable
        onPress={!updating ? pickImage : undefined}
        style={styles.profileImgContainer}
      >
        <Image
          source={uploadedPic?.uri || userProfilePic}
          contentFit="contain"
          placeholderContentFit="contain"
          placeholder={Images.icon}
          style={styles.profilePic}
        />
        <Box
          bg={"primary"}
          borderRadius={"round"}
          p={"xxs"}
          position={"absolute"}
          bottom={0}
          right={0}
        >
          <SimpleLineIcons name="camera" size={s(12)} color={palette.white} />
        </Box>
      </Pressable>

      <Box variant={"surface"} rg={"xl"}>
        <Controller
          control={control}
          name="name"
          render={({
            fieldState: { error },
            field: { value, onChange },
            formState: { defaultValues },
          }) => (
            <TextInput
              autoCapitalize="words"
              value={value}
              onChangeText={onChange}
              placeholder="Full Name"
              error={error?.message}
              defaultValue={defaultValues?.name}
            />
          )}
        />

        <TextInput
          editable={false}
          value={user?.profile.email}
          style={{ color: palette.gray700 }}
        />

        <Controller
          control={control}
          name="phone"
          render={({
            fieldState: { error },
            field: { value, onChange },
            formState: { defaultValues },
          }) => (
            <TextInput
              placeholder="Phone number"
              value={value}
              onChangeText={onChange}
              error={error?.message}
              keyboardType="phone-pad"
              defaultValue={defaultValues?.phone}
            />
          )}
        />
      </Box>
      <Button
        label="Update changes"
        loading={updating}
        onPress={handleUpdate}
      />
    </ScreenBox>
  );
};

EditProfileScreen.displayName = "EditProfileScreen";

const useStyles = createStyleHook(({ colors, borderRadii }) => ({
  profileImgContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  profilePic: {
    width: "70@s",
    height: "70@s",
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: borderRadii.round,
  },
}));
