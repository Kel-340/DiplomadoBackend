import { Router } from "express";
import ReportController from "../controllers/report.controller.js";
import ReportService from "../../application/use-cases/report.service.js";
import TransactionMySQLRepository from "../../infrastructure/database/mysql/transaction.mysql.repository.js";
import AuditMySQLRepository from "../../infrastructure/database/mysql/audit.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
// Inyección de dependencias
const transactionRepository = new TransactionMySQLRepository();
const auditRepository = new AuditMySQLRepository();
const reportService = new ReportService(transactionRepository, auditRepository);
const reportController = new ReportController(reportService);
 
const router = Router();
 
/**
 * @swagger
 * /reports/summary:
 *   get:
 *     summary: Obtener balance general de ingresos, egresos y saldo neto
 *     tags: [Reports & Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           example: "2026-11-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           example: "2026-11-30"
 *     responses:
 *       200:
 *         description: Resumen de ingresos, egresos y balance
 */
router.get("/summary", authMiddleware, reportController.getBalanceSummary);
 
/**
 * @swagger
 * /reports/by-category:
 *   get:
 *     summary: Obtener reporte agrupado por categoría
 *     tags: [Reports & Audits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Totales agrupados por categoría
 */
router.get("/by-category", authMiddleware, reportController.getExpensesByCategory);
 
/**
 * @swagger
 * /reports/by-exchange-rate:
 *   get:
 *     summary: Reporte de transacciones agrupadas por fecha de tipo de cambio aplicado
 *     tags: [Reports & Audits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agrupación de montos originales y convertidos por fecha de tipo de cambio
 */
router.get("/by-exchange-rate", authMiddleware, reportController.getTransactionsByExchangeRateReport);
 
/**
 * @swagger
 * /reports/audits:
 *   get:
 *     summary: Obtener historial de auditoría del usuario en MySQL
 *     tags: [Reports & Audits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bitácora de auditoría del usuario
 */
router.get("/audits", authMiddleware, reportController.getUserAudits);
 
export default router;