import { DataTypes, Op, fn, col } from "sequelize";
import sequelize from "./connection.js";
 
export const TransactionModel = sequelize.define("Transaction", {
    type: { type: DataTypes.ENUM("INCOME", "EXPENSE"), allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: "BOB" },
    exchangeRate: { type: DataTypes.DECIMAL(12, 4), allowNull: false, defaultValue: 1 },
    exchangeRateDate: { type: DataTypes.DATEONLY, allowNull: false },
    currencyRateId: { type: DataTypes.STRING, allowNull: true },
    convertedAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    description: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });
 
export default class TransactionMySQLRepository {
    async save(txEntity) {
        const tx = await TransactionModel.create({
            type: txEntity.type,
            amount: txEntity.amount,
            currency: txEntity.currency,
            exchangeRate: txEntity.exchangeRate,
            exchangeRateDate: txEntity.exchangeRateDate,
            currencyRateId: txEntity.currencyRateId,
            convertedAmount: txEntity.convertedAmount,
            description: txEntity.description,
            date: txEntity.date,
            categoryId: txEntity.categoryId,
            userId: txEntity.userId
        });
        return tx.toJSON();
    }
 
    async findByUserId(userId) {
        return await TransactionModel.findAll({
            where: { userId },
            order: [["date", "DESC"], ["id", "DESC"]]
        });
    }
 
    async findById(id) {
        const tx = await TransactionModel.findByPk(id);
        return tx ? tx.toJSON() : null;
    }
 
    async update(id, data) {
        const tx = await TransactionModel.findByPk(id);
        if (!tx) return null;
        await tx.update(data);
        return tx.toJSON();
    }
 
    async delete(id) {
        const tx = await TransactionModel.findByPk(id);
        if (!tx) return null;
        await tx.destroy();
        return true;
    }
 
    async findByCurrencyRateDate(userId, currency, exchangeRateDate) {
        return await TransactionModel.findAll({
            where: { userId, currency, exchangeRateDate }
        });
    }
 
    async sumExpensesByCategoryAndMonth(userId, categoryId, month, year) {
        const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const endDate = `${year}-${String(month).padStart(2, "0")}-31`;
 
        const total = await TransactionModel.sum("convertedAmount", {
            where: {
                userId,
                categoryId,
                type: "EXPENSE",
                date: { [Op.between]: [startDate, endDate] }
            }
        });
        return Number(total || 0);
    }
 
    async getSummaryByUser(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
 
        const rows = await TransactionModel.findAll({
            attributes: [
                "type",
                [fn("SUM", col("convertedAmount")), "totalConverted"],
                [fn("COUNT", col("id")), "count"]
            ],
            where,
            group: ["type"],
            raw: true
        });
 
        let totalIncome = 0;
        let totalExpense = 0;
 
        rows.forEach((r) => {
            if (r.type === "INCOME") totalIncome = Number(r.totalConverted || 0);
            if (r.type === "EXPENSE") totalExpense = Number(r.totalConverted || 0);
        });
 
        return {
            totalIncome,
            totalExpense,
            balance: Number((totalIncome - totalExpense).toFixed(2))
        };
    }
 
    async getGroupedByCategory(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
 
        return await TransactionModel.findAll({
            attributes: [
                "categoryId",
                "type",
                [fn("SUM", col("convertedAmount")), "totalConverted"],
                [fn("COUNT", col("id")), "count"]
            ],
            where,
            group: ["categoryId", "type"],
            raw: true
        });
    }
 
    async getGroupedByExchangeRateDate(userId) {
        return await TransactionModel.findAll({
            attributes: [
                "currency",
                "exchangeRateDate",
                "exchangeRate",
                "currencyRateId",
                [fn("COUNT", col("id")), "transactionsCount"],
                [fn("SUM", col("amount")), "totalOriginalAmount"],
                [fn("SUM", col("convertedAmount")), "totalConvertedAmount"]
            ],
            where: { userId },
            group: ["currency", "exchangeRateDate", "exchangeRate", "currencyRateId"],
            order: [["exchangeRateDate", "DESC"]],
            raw: true
        });
    }
}
 
 