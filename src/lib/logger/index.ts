type MsgType = "info" | "warn" | "error" | "debug";

const isDev = __DEV__;

const log = (msgType: MsgType, msg: string) => {
  const timestamp = new Date().toISOString();
  const formattedMsg = `[${timestamp}] [${msgType}] ${msg}`;

  if (!isDev) {
    // TODO: add logic to send logs to a remote server or save them locally
    // This could be implemented using a logging service or API endpoint.
    return;
  }

  // Log the message to the console based on the message type
  switch (msgType) {
    case "info":
      console.info(formattedMsg);
      break;
    case "warn":
      console.warn(formattedMsg);
      break;
    case "error":
      console.error(formattedMsg);
      break;
    case "debug":
      console.debug(formattedMsg);
      break;
    default:
      console.log(formattedMsg);
      break;
  }
};

export const logger = {
  info: (msg: string) => log("info", msg),
  warn: (msg: string) => log("warn", msg),
  error: (msg: string) => log("error", msg),
  debug: (msg: string) => log("debug", msg),
};
