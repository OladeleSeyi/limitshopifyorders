import { getShopifyClient } from "../../utils/library";

interface IMerchantInfo {
  fetch(shop: string, token: string): Promise<any>;
}

class MerchantInfo implements IMerchantInfo {
  constructor() {}
  async fetch(shop: string, token: string) {
    const Client = getShopifyClient({ shop, token, version: "2022-04" });
    const query = `
      query {
        shop {
          email
          checkoutApiSupported
          currencyCode
          currencyFormats {
            moneyFormat
            moneyWithCurrencyFormat
          }
          customerAccounts
          id
          name
          plan {
            displayName
            partnerDevelopment
            shopifyPlus
          }
          url
        }
      }
    `;
    const { data } = await Client.post("/graphql.json", { query });
    const payload = data.data.shop;
    return payload;
  }
}

const Shop = new MerchantInfo();
const getUserShopifyInfo: IMerchantInfo["fetch"] = Shop.fetch.bind(Shop);

export { getUserShopifyInfo };
