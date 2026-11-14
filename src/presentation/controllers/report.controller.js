export default class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
 
    getBalanceSummary = async (req, res) => {
        const { startDate, endDate } = req.query;
        try {
            const summary = await this.reportService.getBalanceSummary(req.user.id, startDate, endDate);
            res.status(200).json(summary);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getExpensesByCategory = async (req, res) => {
        const { startDate, endDate } = req.query;
        try {
            const breakdown = await this.reportService.getExpensesByCategory(req.user.id, startDate, endDate);
            res.status(200).json(breakdown);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getTransactionsByExchangeRateReport = async (req, res) => {
        try {
            const report = await this.reportService.getTransactionsByExchangeRateReport(req.user.id);
            res.status(200).json(report);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getUserAudits = async (req, res) => {
        try {
            const audits = await this.reportService.getUserAudits(req.user.id);
            res.status(200).json(audits);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}