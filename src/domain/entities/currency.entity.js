export default class CurrencyEntity {
    constructor({ id, code, name, symbol, exchangeRate, date }) {
        this.id = id;
        this.code = code ? code.toUpperCase() : "BOB";
        this.name = name;
        this.symbol = symbol || "$";
        this.exchangeRate = Number(exchangeRate || 1);
        this.date = date || new Date().toISOString().split("T")[0];
    }
}