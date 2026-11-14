import { Schema, model } from "mongoose";
 
const currencySchema = new Schema({
    code: { type: String, required: true, uppercase: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    exchangeRate: { type: Number, required: true },
    date: { type: String, required: true }
}, { timestamps: true });
 
currencySchema.index({ code: 1, date: 1 }, { unique: true });
 
export default model("Currency", currencySchema);