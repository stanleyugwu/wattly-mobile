import { logger } from "../logger";

// globalErrorHandler.ts
export const globalErrorHandler = (error: any, isFatal?: boolean) => {
  logger.error(
    `Global Error Handler`,
    { error, isFatal },
    { function: "globalErrorHandler" }
  );
};
