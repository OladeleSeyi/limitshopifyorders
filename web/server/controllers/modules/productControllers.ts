import { Context } from "koa";
import { Webhook } from "../../app";
import { ProductDb } from "../../database";

export const productController = async (ctx: Context) => {
  //TODO
  // validate input
  // verify validy of product?
  const { body } = ctx.request;
  const { shop, accessToken } = ctx.state.shopify;
  try {
    await ProductDb.findOneAndUpdate({ shopifyId: body.productId }, body, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
    const webhook = new Webhook(shop, accessToken);

    await webhook.register(process.env.HOST!, "carts/create", "CARTS_CREATE");

    await webhook.register(process.env.HOST!, "carts/update", "CARTS_UPDATE");
  } catch (error) {
    ctx.body = {
      statusCode: 400,
      message: "Something went wrong",
    };
  }
  ctx.body = {
    statusCode: 200,
    message: "Product limits set",
  };
  ctx.response.status = 200;
};
