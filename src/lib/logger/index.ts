import * as Sentry from "@sentry/react-native";

type MsgType = "info" | "warn" | "error" | "debug";
type Tags = Record<string, string>;

const log = (msgType: MsgType, msg: string, ctx?: any, tags?: Tags) => {
  const timestamp = new Date().toISOString();
  const formattedMsg = `[${timestamp}] [${msgType}] ${msg}`;

  if (!__DEV__) {
    switch (msgType) {
      case "error":
        Sentry.captureException(new Error(msg), {
          extra: ctx,
          tags,
          level: "error",
        });
        break;
      case "warn":
        Sentry.captureMessage(msg, {
          extra: ctx,
          tags,
          level: "warning",
        });
        break;
      case "info":
        Sentry.captureMessage(msg, {
          extra: ctx,
          tags,
          level: "info",
        });
        break;
      case "debug":
        // Sentry.captureMessage(msg, {
        //   extra: ctx,
        //   level: "debug",
        // });
        break;
    }

    return; // skip local console logging in prod
  }

  // Log the message to the console based on the message type
  switch (msgType) {
    case "info":
      console.info(formattedMsg, JSON.stringify(ctx));
      break;
    case "warn":
      console.warn(formattedMsg, JSON.stringify(ctx || ""));
      break;
    case "error":
      console.error(formattedMsg, JSON.stringify(ctx || ""));
      break;
    case "debug":
      console.debug(formattedMsg, JSON.stringify(ctx || ""));
      break;
    default:
      console.log(formattedMsg, JSON.stringify(ctx || ""));
      break;
  }
};

export const logger = {
  info: (msg: string, ctx?: any, tags?: Tags) => log("info", msg, ctx, tags),
  warn: (msg: string, ctx?: any, tags?: Tags) => log("warn", msg, ctx, tags),
  error: (msg: string, ctx?: any, tags?: Tags) => log("error", msg, ctx, tags),
  debug: (msg: string, ctx?: any, tags?: Tags) => log("debug", msg, ctx, tags),
};
