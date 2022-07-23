import { Context, Next } from "koa";
import helmet from "koa-helmet";
import { createUser } from "../../auth";
import { getUserShopifyInfo } from "../../auth";
import { registerWebhook } from "../../app";
import { validateWebhookRequest, AppError } from "../../utils";

export const contentSecHeader = (ctx: Context, next: Next) => {
  // Cookie is set after auth
  if (ctx.cookies.get("shopOrigin")) {
    return helmet.contentSecurityPolicy({
      directives: {
        // @ts-ignore
        defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
        frameAncestors: [
          `https://${ctx.cookies.get("shopOrigin")}`,
          "https://admin.shopify.com",
        ],
      },
    })(ctx, next);
  } else {
    // Before auth => no cookie set...
    return helmet.contentSecurityPolicy({
      directives: {
        // @ts-ignore
        defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
        frameAncestors: [
          `https://${ctx.query.shop}`,
          "https://admin.shopify.com",
        ],
      },
    })(ctx, next);
  }
};

export const afterAuth = async (ctx: Context) => {
  // Access token and shop available in ctx.state.shopify
  const { shop, accessToken, scope } = ctx.state.shopify;
  const token = accessToken;
  const userinfo = await getUserShopifyInfo(shop, token);
  //  creates a user after installation
  await createUser(shop, scope, userinfo.name, userinfo);

  // register app/uninstalled webhook
  await registerWebhook({
    shop,
    token,
    HOST: process.env.HOST!,
    endpoint: "apps/uninstalled",
    topic: "APP_UNINSTALLED",
  });

  // Redirect to app with shop parameter upon auth
  ctx.redirect(`https://${shop}/admin/apps/your-awesome-shopify-app-name`);
};

export const authenticateWebhook = async (ctx: Context, next: Next) => {
  const { body } = ctx.request;
  const { rawBody } = ctx.request;
  const shop = ctx.headers["x-shopify-shop-domain"];
  const topic = ctx.headers["x-shopify-topic"];
  const id = ctx.headers["x-shopify-webhook-id"];
  const hmac = ctx.headers["x-shopify-hmac-sha256"];
  const auth = validateWebhookRequest(hmac, rawBody);
  if (!auth) throw new AppError("Unauthorized app usage.", 401);

  ctx.state = { shop, topic, id, payload: body };
  return next();
};
