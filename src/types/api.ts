export type APIResponse<D = null> = {
  data: D;
  message?: string;
  method: string;
  url: string;
};
