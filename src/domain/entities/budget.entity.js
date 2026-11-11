export default class BudgetEntity {
    constructor({ id, amountLimit, month, year, categoryId, userId }) {
        this.id = id;
        this.amountLimit = Number(amountLimit);
        this.month = Number(month);
        this.year = Number(year);
        this.categoryId = categoryId;
        this.userId = userId;
    }
}
 