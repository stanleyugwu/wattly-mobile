import { ImagePickerAsset } from "expo-image-picker";
import { z } from "zod";
import {
  changePasswordSchema,
  changeTransferPinSchema,
  editProfileSchema,
  transferPinResetSchema,
} from "./schema";

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

export interface ProfileUpdateParam {
  name: string;
  phone: string;
  profilePic?: ImagePickerAsset;
}

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangePasswordReqPayload = {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
};

export type ResetPinReqPayload = {
  email: string;
  otp: string;
  new_pin: string;
  new_pin_confirmation: string;
};

export type ChangeTransferPinFormData = z.infer<typeof changeTransferPinSchema>;
export type ResetTransferPinFormData = z.infer<typeof transferPinResetSchema>;
