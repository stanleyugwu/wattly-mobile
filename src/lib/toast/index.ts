import { ToastType } from "@/types";
import BaseToast, { ToastShowParams } from "react-native-toast-message";

export const Toast = {
  [ToastType.Success]: (message: string, options?: ToastShowParams) => {
    return BaseToast.show({
      type: ToastType.Success,
      text2: message,
      position: "bottom",
      ...options,
    });
  },
  [ToastType.Error]: (message: string, options?: ToastShowParams) => {
    return BaseToast.show({
      type: ToastType.Error,
      text2: message,
      position: "bottom",
      ...options,
    });
  },
  [ToastType.Info]: (message: string, options?: ToastShowParams) => {
    return BaseToast.show({
      type: ToastType.Info,
      text2: message,
      position: "bottom",
      ...options,
    });
  },
};
