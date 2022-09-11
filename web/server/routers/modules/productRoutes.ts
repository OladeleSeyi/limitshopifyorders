import Router from "koa-router";
import combineRouters from "koa-combine-routers";
import { productController } from "../../controllers";

const router = new Router({ prefix: "/products" });

router.post("/limits", productController);

const routes = combineRouters(router);
export default routes;
