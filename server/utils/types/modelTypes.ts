export interface ISessionModel {
  id: string;
  payload: {
    shop: string;
    state: string;
    scope: string;
    accessToken: string;
    isOnline: boolean;
    expires: any;
    onlineAccessInfo: any;
  };
  shop: string;
}

export interface IUserModel {
  shop: string;
  scope: string;
  name: string;
  updated_at: Date;
  uninstalled: boolean;
  theme_status: "none" | "automatic" | "app_block";
  deleted: boolean;
  user_info: any;
}

export interface IWebhookModel {
  shop: string;
  webhook_id: string;
  webhook_topic: string;
  payload: any;
  time_received: Date;
}
