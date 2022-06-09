import { AxiosInstance } from "axios";
import { getShopifyClient, handleShopifyGQLError } from "../../utils/library";

interface IWebhook {
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

class Webhook implements IWebhook {
  constructor() {}
  private async _getWebhooks({
    Client,
    topic,
  }: {
    Client: AxiosInstance;
    topic: string;
  }) {
    const query = `
      query {
        webhookSubscriptions(
          first: 1
           topics:[${topic}]
        ) {
          nodes {
            id
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
        }
      }
    `;
    const { data } = await Client.post("/graphql.json", { query });
    if (data.errors?.length) handleShopifyGQLError(data.errors);
    return data.data.webhookSubscriptions?.nodes;
  }
  private async _writeWebhook({
    Client,
    HOST,
    topic,
    endpoint,
  }: {
    Client: AxiosInstance;
    HOST: string;
    topic: string;
    endpoint: string;
  }) {
    const query = `
      mutation {
        webhookSubscriptionCreate(
          topic: ${topic}
          webhookSubscription: {
            callbackUrl: "${HOST}/webhooks/${endpoint}"
            format: JSON
          }
        ) {
          webhookSubscription {
            id
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
          userErrors {
            message
            field
          }
        }
      }
    `;
    const { data } = await Client.post("/graphql.json", { query });
    if (data.errors?.length) handleShopifyGQLError(data.errors);
    const queryErrors = data.data.webhookSubscriptionCreate.userErrors;
    if (queryErrors.length) handleShopifyGQLError(queryErrors);
    return data.data.webhookSubscriptionCreate.webhookSubscription;
  }
  private async _deleteWebhook(
    Client: AxiosInstance,
    Id: string
  ): Promise<void> {
    const query = `
      mutation {
        webhookSubscriptionDelete(
          id: "${Id}"
        ) {
          deletedWebhookSubscriptionId
          userErrors {
            message
            field
          }
        }
      }
    `;
    const { data } = await Client.post("/graphql.json", { query });
    if (data.errors?.length) handleShopifyGQLError(data.errors);
    const queryErrors = data.data.webhookSubscriptionDelete.userErrors;
    if (queryErrors.length) handleShopifyGQLError(queryErrors);
    return data.data.webhookSubscriptionDelete.deletedWebhookSubscriptionId;
  }
  async register({ shop, token, HOST, endpoint, topic }) {
    try {
      const Client = getShopifyClient({ shop, token, version: "2022-04" });
      const webhooks = await this._getWebhooks({ Client, topic });
      const url = `${HOST}/webhooks/${endpoint}`;
      const exists = webhooks.some(
        (webhook) =>
          topic == webhook.topic && url == webhook.endpoint.callbackUrl
      );
      if (exists) return console.info(`${topic} webhook exists on ${shop}`);
      else {
        await this._writeWebhook({
          Client,
          HOST,
          topic,
          endpoint,
        });
        console.info(`registered ${topic} webhook for ${shop}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async deleteAll({ shop, token, topic }) {
    try {
      const Client = getShopifyClient({ shop, token, version: "2022-04" });
      const webhooks = await this._getWebhooks({ Client, topic });
      if (webhooks.length) {
        for (const webhook of webhooks) {
          await this._deleteWebhook(Client, webhook.id);
        }
        console.info(`deleted ${topic} webhook on ${shop}`);
      } else console.info(`no  ${topic} webhook on ${shop}`);
    } catch (error) {
      console.error(error);
    }
  }
}

const webhook = new Webhook();
const registerWebhook: IWebhook["register"] = webhook.register.bind(webhook);
const deleteWebhook: IWebhook["deleteAll"] = webhook.deleteAll.bind(webhook);
export { registerWebhook, deleteWebhook };
