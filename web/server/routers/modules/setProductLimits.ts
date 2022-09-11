import Router from "koa-router";
import combineRouters from "koa-combine-routers";
import { productLimitController } from "../../controllers";

const router = new Router({ prefix: "/products" });

router.post("/limits", productLimitController);

const routes = combineRouters(router);
export default routes;
