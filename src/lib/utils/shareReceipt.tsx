import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

import { logger } from "../logger";
import { Toast } from "../toast";

export const shareReceiptAsImage = async (
  viewShotRef: React.RefObject<null>,
  txId: string = "",
  namePrefix?: string
) => {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      Toast.error("Sharing is not available on this device");
      return;
    }

    const uri = await captureRef(viewShotRef, {
      format: "png",
      quality: 1,
    });

    // copy from temp folder to file system to allow easy sharing
    const fileUri = `${FileSystem.cacheDirectory}${
      namePrefix || "Transaction"
    }-Receipt-${txId}.png`;
    await FileSystem.copyAsync({ from: uri, to: fileUri });

    await Sharing.shareAsync(fileUri);
  } catch (error: any) {
    logger.error("Tx receipt image sharing failed", { error });
    Toast.error("Failed to share receipt image");
  }
};

export const shareReceiptAsPdf = async (
  viewShotRef: React.RefObject<null>,
  txId: string = ""
) => {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      Toast.error("Sharing is not available on this device");
      return;
    }

    const uri = await captureRef(viewShotRef, {
      format: "png",
      quality: 1,
      fileName: `Transaction-Receipt-${txId}.pdf`,
    });

    // Generate simple HTML embedding the image
    const html = `
      <html>
        <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center;">
          <img src="data:image/png;base64,${await FileSystem.readAsStringAsync(
            uri,
            { encoding: FileSystem.EncodingType.Base64 }
          )}" style="max-width:100%;"/>
        </body>
      </html>
    `;
    const { uri: pdfUri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(pdfUri);
  } catch (error) {
    logger.error("Tx receipt PDF sharing failed", { error });
    Toast.error("Failed to share receipt PDF");
  }
};
