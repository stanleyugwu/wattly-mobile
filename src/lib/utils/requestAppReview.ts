import * as StoreReview from "expo-store-review";
import { logger } from "../logger";

export async function requestAppStoreReview() {
  // 1. Check if supported
  const isAvailable =
    StoreReview.isAvailableAsync && (await StoreReview.isAvailableAsync());
  if (!isAvailable) {
    logger.debug("In-app review not available on this device");
    return;
  }

  // 2. Ask for review
  try {
    await StoreReview.requestReview();
  } catch (e) {
    logger.error("Error requesting review:");
  }
}
