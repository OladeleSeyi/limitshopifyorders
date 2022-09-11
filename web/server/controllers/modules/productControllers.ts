import { Context } from "koa";
import { ProductDb } from "../../database";

export const productController = async (ctx: Context) => {
  //TODO
  // validate input
  // verify validy of product
  const { body } = ctx.request;
  try {
    await ProductDb.findOneAndUpdate({ shopifyId: body.productId }, body, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
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
