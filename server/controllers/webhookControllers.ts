import { Context } from "koa";
import AppError from "../utils/appError";
import { removeSession } from "../auth";
import { validateWebhookRequest, saveWebhook } from "../utils/library";

export const webhookController = async (ctx: Context) => {
  const { body } = ctx.request;
  const shop = ctx.request.header["x-shopify-shop-domain"];
  const hmac = ctx.request.headers["x-shopify-hmac-sha256"];
  const topic = ctx.request.headers["x-shopify-topic"];
  const id = ctx.request.headers["x-shopify-webhook-id"];

  const auth = validateWebhookRequest(hmac, ctx.request.rawBody);
  if (!auth) throw new AppError("Unauthorized api request", 401);

  const data = {
    shop,
    webhook_id: id,
    webhook_topic: topic,
    payload: body,
    time_received: Date.now(),
  };

  await saveWebhook(data);
  if (topic == "app/uninstalled") await removeSession(shop);
  ctx.body = {
    statusCode: 200,
    message: "Webhook successfully processed",
  };
  ctx.response.status = 200;
};
