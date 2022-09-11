import mongoose from "mongoose";
import { IShopModel } from "../types";

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  limit: String,
  shopifyId: String,
  store: String,
});

const Shop = mongoose.model<IShopModel>("Shop", shopSchema, "shops");

export default Shop;
