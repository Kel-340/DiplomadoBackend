import BudgetEntity from "../../domain/entities/budget.entity.js";
import AuditEntity from "../../domain/entities/audit.entity.js";
 
export default class BudgetService {
    constructor(budgetRepository, transactionRepository, auditRepository = null) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.auditRepository = auditRepository;
    }
 
    async createOrUpdateBudget(data) {
        if (!data.amountLimit || !data.month || !data.year || !data.categoryId || !data.userId) {
            throw new Error("amountLimit, month, year, categoryId and userId are required");
        }
        if (Number(data.amountLimit) <= 0) {
            throw new Error("Budget amountLimit must be greater than zero");
        }
 
        const budget = new BudgetEntity(data);
        const saved = await this.budgetRepository.save(budget);
 
        if (this.auditRepository) {
            await this.auditRepository.save(new AuditEntity({
                action: "SAVE_BUDGET",
                entity: "BUDGET",
                entityId: saved.id,
                details: saved,
                userId: data.userId
            }));
        }
 
        return saved;
    }
 
    async getBudgetsByUserId(userId, month, year) {
        const budgets = await this.budgetRepository.findByUserId(userId, month, year);
        const results = [];
 
        for (const b of budgets) {
            const spent = await this.transactionRepository.sumExpensesByCategoryAndMonth(
                userId,
                b.categoryId,
                b.month,
                b.year
            );
            const limit = Number(b.amountLimit);
            const totalSpent = Number(spent || 0);
            results.push({
                ...b,
                totalSpent,
                remaining: Number((limit - totalSpent).toFixed(2)),
                percentageUsed: Number(((totalSpent / limit) * 100).toFixed(2)),
                exceeded: totalSpent > limit
            });
        }
 
        return results;
    }
 
    async deleteBudget(id, userId) {
        const budget = await this.budgetRepository.findById(id);
        if (!budget) throw new Error("Budget not found");
        if (budget.userId !== userId) throw new Error("Unauthorized");
 
        await this.budgetRepository.delete(id);
        return { message: "Budget deleted successfully" };
    }
}
 