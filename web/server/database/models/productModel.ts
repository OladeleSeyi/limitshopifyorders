import mongoose from "mongoose";
import { IProductModel } from "../types";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  limit: String,
  shopifyId: String,
  store: String,
});

const Product = mongoose.model<IProductModel>(
  "Product",
  productSchema,
  "products"
);

export default Product;
