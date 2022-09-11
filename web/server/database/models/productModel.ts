import mongoose from "mongoose";
import { IProductModel } from "../types";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  limit: Number,
  shopifyId: String,
  shop: String,
});

const Product = mongoose.model<IProductModel>(
  "Product",
  productSchema,
  "products"
);

export default Product;
