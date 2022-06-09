import { Context } from "koa";
import next from "next";
import AppError from "../utils/appError";
import { getUserAccessToken } from "../auth";
import { validateMerchantRequest } from "../utils/library";

const dev = process.env.NODE_ENV !== "production";
export const nextApp = next({
  dev,
});

const handle = nextApp.getRequestHandler();

export const handleRequest = async (ctx: Context) => {
  // @ts-ignore
  await handle(ctx.req, ctx.res);
  ctx.respond = false;
  ctx.res.statusCode = 200;
};

export const generalNextController = async (ctx: Context) => {
  const { shop } = ctx.query;
  if (!shop)
    throw new AppError("Unauthorized app usage, shop not specified.", 401);
  const checkSession = await getUserAccessToken(shop);
  // This shop hasn't been seen yet, go through OAuth to create a session
  if (!checkSession) {
    ctx.redirect(`/auth?shop=${shop}`);
  } else {
    const auth = validateMerchantRequest(ctx);
    if (!auth.authorized) return ctx.redirect(`/auth?shop=${shop}`);
    await handleRequest(ctx);
  }
};
