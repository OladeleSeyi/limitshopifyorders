import { Context } from "koa";
import { removeSession } from "../../auth";
import { saveWebhook } from "../../utils/lib/library";
import { Checkout } from "@shopify/shopify-api/dist/rest-resources/2022-07/index.js";
import Shopify from "@shopify/shopify-api";
import { Session } from "@shopify/shopify-api/dist/auth/session";
import { ProductDb, SessionDb } from "../../database";

export const webhookController = async (ctx: Context) => {
  const { shop, topic, id, payload } = ctx.state;

  const data = {
    shop,
    webhook_id: id,
    webhook_topic: topic,
    payload,
    time_received: Date.now(),
  };

  await saveWebhook(data);
  if (topic == "app/uninstalled") await removeSession(shop);

  if (topic == "cart/created" || topic == "cart/updated") {
    let session = getOrCreateWebhookSession(ctx, shop);
    try {
      const cart = await Checkout.find({
        // @ts-expect-error
        session: session,
        token: payload.token,
      });

      await modifyCartContents(cart, session, payload.token);
    } catch (err) {
      throw err;
    }
  }

  ctx.body = {
    statusCode: 200,
    message: "Webhook successfully processed",
  };
  ctx.response.status = 200;
};

// TODO: Add checks for replay attack
// move utility func to another file
// Promisify: Promise.some/all ?
const modifyCartContents = async (cart, session, token) => {
  let newLineItems: any[] = [];
  cart.checkout.line_items.map(async (item) => {
    const productSetting = await ProductDb.findOne({ shopifyId: item.id });
    if (!productSetting) {
      return newLineItems.push(item);
    }
    if (productSetting.limit > item.qauntity) {
      return newLineItems.push({ ...item, qauntity: productSetting.limit });
    }
    return newLineItems.push(item);
  });

  const updatedCheckout = new Checkout({ session: session });
  updatedCheckout.token = token;
  updatedCheckout.line_items = newLineItems;
  await updatedCheckout.save({
    update: true,
  });
};

const getOrCreateWebhookSession = async (
  ctx: Context,
  shop: string
): Promise<Session> => {
  let currentSession;
  currentSession = await Shopify.Utils.loadCurrentSession(
    ctx.req,
    ctx.res,
    false
  );

  if (currentSession) {
    return currentSession;
  }
  currentSession = await SessionDb.findOne({ shop: shop });
  const { state, scope, accessToken, isOnline, expires, onlineAccessInfo } =
    currentSession.payload;
  const session = new Session(currentSession.id, shop, state, isOnline);

  session.scope = scope;
  session.accessToken = accessToken;
  session.expires = expires;
  session.onlineAccessInfo = onlineAccessInfo;
  return session;
};
