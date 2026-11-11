export default class TransactionEntity {
    constructor({
        id,
        type,
        amount,
        currency,
        exchangeRate,
        exchangeRateDate,
        currencyRateId,
        convertedAmount,
        description,
        date,
        categoryId,
        userId
    }) {
        this.id = id;
        this.type = type;
        this.amount = Number(amount);
        this.currency = currency ? currency.toUpperCase() : "BOB";
        this.exchangeRate = Number(exchangeRate || 1);
        this.exchangeRateDate = exchangeRateDate || new Date().toISOString().split("T")[0];
        this.currencyRateId = currencyRateId || null;
        this.convertedAmount = convertedAmount !== undefined
            ? Number(convertedAmount)
            : Number((Number(amount) * Number(exchangeRate || 1)).toFixed(2));
        this.description = description || "";
        this.date = date || new Date().toISOString().split("T")[0];
        this.categoryId = categoryId;
        this.userId = userId;
    }
}