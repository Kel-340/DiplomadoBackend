import { Router } from "express";
import CurrencyController from "../controllers/currency.controller.js";
import CurrencyService from "../../application/use-cases/currency.service.js";
import CurrencyMongoRepository from "../../infrastructure/database/mongo/currency.mongo.repository.js";
import TransactionMySQLRepository from "../../infrastructure/database/mysql/transaction.mysql.repository.js";
import AuditMySQLRepository from "../../infrastructure/database/mysql/audit.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
// Inyección de dependencias
const currencyRepository = new CurrencyMongoRepository();
const transactionRepository = new TransactionMySQLRepository();
const auditRepository = new AuditMySQLRepository();
const currencyService = new CurrencyService(currencyRepository, transactionRepository, auditRepository);
const currencyController = new CurrencyController(currencyService);
 
const router = Router();
 
/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Obtener todas las monedas y sus tipos de cambio por fecha
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de monedas y tipos de cambio
 */
router.get("/", authMiddleware, currencyController.getAllCurrencies);
 
/**
 * @swagger
 * /currencies:
 *   post:
 *     summary: Registrar o actualizar el tipo de cambio de una moneda en una fecha específica
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, exchangeRate]
 *             properties:
 *               code:
 *                 type: string
 *                 example: "USD"
 *               name:
 *                 type: string
 *                 example: "Dólar Estadounidense"
 *               symbol:
 *                 type: string
 *                 example: "$"
 *               exchangeRate:
 *                 type: number
 *                 example: 6.96
 *               date:
 *                 type: string
 *                 example: "2026-11-08"
 *     responses:
 *       201:
 *         description: Tipo de cambio guardado exitosamente para la fecha indicada
 */
router.post("/", authMiddleware, currencyController.saveCurrencyRateByDate);
 
/**
 * @swagger
 * /currencies/by-date:
 *   get:
 *     summary: Consultar el tipo de cambio de una fecha y todas las transacciones calculadas con ese tipo de cambio
 *     tags: [Currencies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: "USD"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "2026-11-08"
 *     responses:
 *       200:
 *         description: Tipo de cambio del día y transacciones relacionadas
 */
router.get("/by-date", authMiddleware, currencyController.getCurrencyRateByDate);
 
export default router;