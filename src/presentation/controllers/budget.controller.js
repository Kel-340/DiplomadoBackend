export default class BudgetController {
    constructor(budgetService) {
        this.budgetService = budgetService;
    }
 
    createOrUpdateBudget = async (req, res) => {
        const data = { ...req.body, userId: req.user.id };
        try {
            const budget = await this.budgetService.createOrUpdateBudget(data);
            res.status(201).json(budget);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getBudgetsByUserId = async (req, res) => {
        const { month, year } = req.query;
        try {
            const budgets = await this.budgetService.getBudgetsByUserId(req.user.id, month, year);
            res.status(200).json(budgets);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };
 
    deleteBudget = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await this.budgetService.deleteBudget(id, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };
}
 