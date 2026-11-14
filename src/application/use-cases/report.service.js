export default class ReportService {
    constructor(transactionRepository, auditRepository) {
        this.transactionRepository = transactionRepository;
        this.auditRepository = auditRepository;
    }
 
    async getBalanceSummary(userId, startDate, endDate) {
        return await this.transactionRepository.getSummaryByUser(userId, startDate, endDate);
    }
 
    async getExpensesByCategory(userId, startDate, endDate) {
        return await this.transactionRepository.getGroupedByCategory(userId, startDate, endDate);
    }
 
    async getTransactionsByExchangeRateReport(userId) {
        return await this.transactionRepository.getGroupedByExchangeRateDate(userId);
    }
 
    async getUserAudits(userId) {
        return await this.auditRepository.findByUserId(userId);
    }
}