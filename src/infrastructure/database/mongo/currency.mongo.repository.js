import CurrencyModel from "./currency.model.js";
 
export default class CurrencyMongoRepository {
    async saveByDate(currencyEntity) {
        return await CurrencyModel.findOneAndUpdate(
            { code: currencyEntity.code, date: currencyEntity.date },
            {
                name: currencyEntity.name,
                symbol: currencyEntity.symbol,
                exchangeRate: currencyEntity.exchangeRate
            },
            { upsert: true, new: true }
        );
    }
 
    async findAll() {
        return await CurrencyModel.find().sort({ date: -1, code: 1 });
    }
 
    async findByCodeAndDate(code, date) {
        const exact = await CurrencyModel.findOne({ code, date });
        if (exact) return exact;
 
        return await CurrencyModel.findOne({
            code,
            date: { $lte: date }
        }).sort({ date: -1 });
    }
 
    async seedCurrencies() {
        const count = await CurrencyModel.countDocuments();
        if (count === 0) {
            const today = new Date().toISOString().split("T")[0];
            await CurrencyModel.insertMany([
                { code: "BOB", name: "Boliviano", symbol: "Bs.", exchangeRate: 1, date: today },
                { code: "USD", name: "Dólar Estadounidense", symbol: "$", exchangeRate: 6.96, date: today },
                { code: "EUR", name: "Euro", symbol: "€", exchangeRate: 7.55, date: today }
            ]);
            console.log("Seeded default currencies in MongoDB");
        }
    }
}
