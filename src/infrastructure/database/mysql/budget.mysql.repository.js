import { DataTypes } from "sequelize";
import sequelize from "./connection.js";
 
export const BudgetModel = sequelize.define("Budget", {
    amountLimit: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    month: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });
 
export default class BudgetMySQLRepository {
    async save(budgetEntity) {
        const existing = await BudgetModel.findOne({
            where: {
                userId: budgetEntity.userId,
                categoryId: budgetEntity.categoryId,
                month: budgetEntity.month,
                year: budgetEntity.year
            }
        });
 
        if (existing) {
            await existing.update({ amountLimit: budgetEntity.amountLimit });
            return existing.toJSON();
        }
 
        const created = await BudgetModel.create({
            amountLimit: budgetEntity.amountLimit,
            month: budgetEntity.month,
            year: budgetEntity.year,
            categoryId: budgetEntity.categoryId,
            userId: budgetEntity.userId
        });
        return created.toJSON();
    }
 
    async findByCategoryAndPeriod(userId, categoryId, month, year) {
        const budget = await BudgetModel.findOne({
            where: { userId, categoryId, month, year }
        });
        return budget ? budget.toJSON() : null;
    }
 
    async findByUserId(userId, month, year) {
        const where = { userId };
        if (month) where.month = Number(month);
        if (year) where.year = Number(year);
        const rows = await BudgetModel.findAll({ where });
        return rows.map((r) => r.toJSON());
    }
 
    async findById(id) {
        const budget = await BudgetModel.findByPk(id);
        return budget ? budget.toJSON() : null;
    }
 
    async delete(id) {
        const budget = await BudgetModel.findByPk(id);
        if (!budget) return null;
        await budget.destroy();
        return true;
    }
}
 