export default class CurrencyController {
    constructor(currencyService) {
        this.currencyService = currencyService;
    }
 
    getAllCurrencies = async (req, res) => {
        try {
            const currencies = await this.currencyService.getAllCurrencies();
            res.status(200).json(currencies);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    saveCurrencyRateByDate = async (req, res) => {
        try {
            const userId = req.user.id;
            const saved = await this.currencyService.saveCurrencyRateByDate(req.body, userId);
            res.status(201).json(saved);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
 
    getCurrencyRateByDate = async (req, res) => {
        const { code, date } = req.query;
        try {
            const result = await this.currencyService.getCurrencyRateByDate(code, date, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    };
}
 
 