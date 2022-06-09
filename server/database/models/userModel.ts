import mongoose from "mongoose";
import { IUserModel } from "../../utils/types/modelTypes";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  shop: { type: String, required: [true, "A user must be linked to a shop"] },
  scope: { type: String, required: [true, "A user's scope must be recorded"] },
  name: String,
  deleted: { type: Boolean, default: false },
  updated_at: Date,
  user_info: Schema.Types.Mixed
});

const User = mongoose.model<IUserModel>("User", userSchema, "users");
export default User;
