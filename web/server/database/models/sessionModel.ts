import mongoose from "mongoose";
import { ISessionModel } from "../types";

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  id: String,
  payload: Object,
  shop: String,
});

const Session = mongoose.model<ISessionModel>(
  "Session",
  sessionSchema,
  "sessions"
);
export default Session;
