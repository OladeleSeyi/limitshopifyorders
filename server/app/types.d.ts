export interface IWebhook {
  register({
    shop,
    token,
    HOST,
    endpoint,
    topic,
  }: {
    shop: string;
    token: string;
    HOST: string;
    endpoint: string;
    topic: string;
  }): Promise<void>;
  deleteAll({
    shop,
    token,
    topic,
  }: {
    shop: string;
    token: string;
    topic: string;
  }): Promise<void>;
}
