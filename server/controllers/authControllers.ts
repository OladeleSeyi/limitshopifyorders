import { Context, Next } from "koa";
import helmet from "koa-helmet";
import { createUser } from "../auth";
import { getUserShopifyInfo } from "../auth";
import { registerWebhook } from "../app";

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
  await createUser({ shop, scope, name: userinfo.name, info: userinfo });

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
