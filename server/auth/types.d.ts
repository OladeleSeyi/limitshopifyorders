export interface IMerchantInfo {
  fetch(shop: string, token: string): Promise<UserInfo>;
}
