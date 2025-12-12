import { z } from "zod";
import { electricityTopupSchema } from "./schema";

export type ElectricityTxStatus = "pending" | "initiated" | "delivered";
export interface IElectricityTx {
  token: string; // formatted token string
  id: number;
  user_id: string;
  request_id: string;
  service_id: string;
  variation_code: string;
  billers_code: string;
  amount: string;
  phone: string;
  currency: null | string;
  response: {
    code: string;
    content: {
      errors?: string;
      transactions: {
        status: ElectricityTxStatus;
        product_name: string;
        unique_element: string;
        unit_price: string;
        quantity: number;
        service_verification: null | string;
        channel: string;
        ommission: number;
        total_amount: number;
        discount: null | number;
        type: string;
        email: string;
        phone: string;
        name: null | string;
        convinience_fee: number;
        amount: string;
        platform: string;
        method: string;
        transactionId: string;
        commission_details: {
          amount: number;
          rate: string;
          rate_type: string;
          computation_type: string;
        };
      };
    };
    response_description: string;
    requestId: string;
    amount: number;
    transaction_date: string;
    purchased_code: string;
    customerName: string;
    customerAddress: string;
    meterNumber: string;
    token: string;
    tokenAmount: number;
    exchangeReference: string;
    resetToken: string;
    configureToken: string;
    units: string;
    fixChargeAmount: number;
    tariff: string;
    taxAmount: number;
    debtAmount: number;
    kct1: string;
    kct2: string;
    penalty: number;
    costOfUnit: number;
    announcement: string;
    meterCost: number;
    currentCharge: number;
    lossOfRevenue: number;
    tariffBaseRate: number;
    installationFee: number;
    reconnectionFee: number;
    meterServiceCharge: number;
    administrativeCharge: number;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export enum ElectricityProviders {
  EEDC = "EEDC",
  AEDC = "AEDC",
  IBEDC = "IBEDC",
  EKEDC = "EKEDC",
  IKEDC = "IKEDC",
  BEDC = "BEDC",
  KEDCO = "KEDCO",
  PHED = "PHED",
  JED = "JED",
  KAEDCO = "KAEDCO",
}

export type MeterType = "prepaid" | "postpaid";

export interface ElectricityProvider {
  id: number;
  service_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type ElectricityTopupFormData = z.infer<typeof electricityTopupSchema>;

export interface SavedBeneficiary {
  id: string;
  provider: Pick<ElectricityProvider, "name" | "service_id">;
  meterNo: string;
  meterName: string;
  meterType: MeterType;
}

export interface IMeterInfo {
  code: string;
  content: {
    error?: string;
    Customer_Name: string;
    Address: string;
    Meter_Number: string;
    Customer_Arrears: string;
    Minimum_Amount: string;
    Min_Purchase_Amount: string;
    Can_Vend: "yes" | "no";
    Business_Unit: string;
    Customer_Account_Type: string;
    Meter_Type: "PREPAID" | "POSTPAID";
    WrongBillersCode: boolean;
    commission_details: {
      amount: null | string;
      rate: string;
      rate_type: string;
      computation_type: string;
    };
  };
}

export interface IElectricityTopupResData extends IElectricityTx {}

export type GetMeterInfoReqPayload = {
  billers_code: string;
  service_id: ElectricityProvider["service_id"];
  type: MeterType;
};

export type ElectricityTopupReqPayload = {
  service_id: string;
  /** Meter Number */
  billers_code: string;
  /** Meter Type */
  variation_code: MeterType;
  amount: string;
  phone: string;
};

/**
 * This will be the type of the ref used to hold transaction data for tx details
 * screen to access and render
 */
export type TxDetailRef = {
  details: IElectricityTx | null;
};

export type ServiceChargeResPayload = {
  charge: `${number}`;
};
