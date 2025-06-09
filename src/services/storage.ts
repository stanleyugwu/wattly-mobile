import { logger } from "@/lib/logger";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

class StorageService {
  private storage = AsyncStorage;
  private secureStorage = SecureStore;
  static secureStoreAvailable = true;

  constructor() {
    logger.info("StorageService:: Initializing storage service");
    SecureStore.isAvailableAsync()
      .then((isAvailable) => {
        if (!isAvailable) {
          logger.warn(
            "StorageService:: SecureStore is not available on this device"
          );
          StorageService.secureStoreAvailable = false;
        }
      })
      .catch((error) => {
        logger.error(
          `StorageService:: Error checking SecureStore availability: ${error}`
        );
      });
  }

  /**
   * A map to store secure keys.
   * This is used to manage keys that should be stored securely.
   */
  private secureStoreKeys: Record<string, string> = {};

  /**
   * Prefixes the key with 'wattly::' to avoid conflicts with other storage keys.
   * @param key The key to prefix.
   * @returns The prefixed key.
   */
  withPrefix(key: string): string {
    return `wattly::${key}`;
  }

  /**
   * Retrieves an item from storage.
   * @param key The key of the item to retrieve.
   */
  async getItem<T = string | object>(key: string): Promise<T | null> {
    try {
      key = this.withPrefix(key);
      // Check if the key is in the secure store keys map.
      if (this.secureStoreKeys[key]) {
        // If the item is secure, retrieve it from secure storage.
        const value = await this.secureStorage.getItemAsync(key);
        return value ? JSON.parse(value) : null;
      } else {
        // If the item is not secure, retrieve it from async storage.
        const value = await this.storage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      logger.error(
        `${
          this.secureStoreKeys[key] ? "Secure" : "Async"
        }Storage:: Failed to get item with key:${key} from storage: ${error}`
      );
      // If an error occurs, return null to indicate failure.
      return null;
    }
  }

  /**
   * Sets an item in storage.
   * @param key The key of the item to set.
   * @param value The value of the item to set.
   */
  async setItem(
    key: string,
    value: string | object,
    options?: { secure: boolean }
  ): Promise<boolean> {
    try {
      key = this.withPrefix(key);
      value = JSON.stringify(value);

      // If the item is secure, store it in the secure store keys map.
      if (options?.secure) {
        await this.secureStorage.setItemAsync(key, value);
        this.secureStoreKeys[key] = key;
        return true;
      } else {
        await this.storage.setItem(key, value);
        return true;
      }
    } catch (error) {
      logger.error(
        `${
          options?.secure ? "Secure" : "Async"
        }Storage:: Failed to set item in storage: ${error}`
      );
      // If an error occurs, return false to indicate failure.
      return false;
    }
  }

  /**
   * Removes an item from storage.
   * @param key The key of the item to remove.
   */
  async removeItem(key: string): Promise<boolean> {
    key = this.withPrefix(key);
    try {
      // If the item is secure, remove it from the secure store keys map.
      if (this.secureStoreKeys[key]) {
        await this.secureStorage.deleteItemAsync(key);
        delete this.secureStoreKeys[key];
        return true;
      } else {
        await this.storage.removeItem(key);
        return true;
      }
    } catch (error) {
      logger.warn(
        `${
          this.secureStoreKeys[key] ? "Secure" : "Async"
        }Storage:: Failed to remove item from storage: ${error}`
      );
      return false;
    }
  }

  /**
   * Clears all items from both secure and insecure storage.
   * This will remove all items, so use with caution.
   */
  async clear(): Promise<boolean> {
    logger.info("Storage:: Clearing all items from storage");
    try {
      // Clear secure storage first
      Object.keys(this.secureStoreKeys).forEach(async (key) => {
        await this.secureStorage.deleteItemAsync(key);
      });

      this.secureStoreKeys = {};

      // Then clear async storage
      // TODO: Consider using a more efficient method to clear AsyncStorage
      await this.storage.clear();
      return true;
    } catch (error) {
      logger.error(`Storage:: Failed to clear storage: ${error}`);
      return false;
    }
  }
}

export const storageService = new StorageService();
