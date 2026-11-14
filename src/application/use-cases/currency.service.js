import CurrencyEntity from "../../domain/entities/currency.entity.js";
import AuditEntity from "../../domain/entities/audit.entity.js";
 
export default class CurrencyService {
    constructor(currencyRepository, transactionRepository = null, auditRepository = null) {
        this.currencyRepository = currencyRepository;
        this.transactionRepository = transactionRepository;
        this.auditRepository = auditRepository;
    }
 
    async getAllCurrencies() {
        return await this.currencyRepository.findAll();
    }
 
    async saveCurrencyRateByDate(data, userId) {
        if (!data.code || !data.name || !data.exchangeRate) {
            throw new Error("Code, name and exchangeRate are required");
        }
        if (Number(data.exchangeRate) <= 0) {
            throw new Error("Exchange rate must be greater than zero");
        }
 
        const currencyEntity = new CurrencyEntity(data);
        const saved = await this.currencyRepository.saveByDate(currencyEntity);
 
        if (this.auditRepository && userId) {
            const audit = new AuditEntity({
                action: "SET_EXCHANGE_RATE",
                entity: "CURRENCY",
                entityId: String(saved._id || saved.id),
                details: {
                    code: currencyEntity.code,
                    exchangeRate: currencyEntity.exchangeRate,
                    date: currencyEntity.date
                },
                userId
            });
            await this.auditRepository.save(audit);
        }
 
        return saved;
    }
 
    async getCurrencyRateByDate(code, date, userId = null) {
        if (!code || !date) {
            throw new Error("Currency code and date are required");
        }
 
        const rateRecord = await this.currencyRepository.findByCodeAndDate(code.toUpperCase(), date);
        if (!rateRecord) {
            throw new Error("Exchange rate not found for the specified date");
        }
 
        let relatedTransactions = [];
        if (this.transactionRepository && userId) {
            relatedTransactions = await this.transactionRepository.findByCurrencyRateDate(
                userId,
                code.toUpperCase(),
                rateRecord.date
            );
        }
 
        return {
            exchangeRateRecord: rateRecord,
            transactions: relatedTransactions
        };
    }
}
 
 
 