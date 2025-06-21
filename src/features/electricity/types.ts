export interface IElectricityTx {
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
      transactions: {
        status: string;
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
}
