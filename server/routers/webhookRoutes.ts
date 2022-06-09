import Router from "koa-router";
import combineRouters from "koa-combine-routers";
import { webhookController } from "../controllers/webhookControllers";

const router = new Router({ prefix: "/webhooks" });

router.post("/:category/:sub", webhookController);

const routes = combineRouters(router);
export default routes;
