import { Router } from "express";
import BudgetController from "../controllers/budget.controller.js";
import BudgetService from "../../application/use-cases/budget.service.js";
import BudgetMySQLRepository from "../../infrastructure/database/mysql/budget.mysql.repository.js";
import TransactionMySQLRepository from "../../infrastructure/database/mysql/transaction.mysql.repository.js";
import AuditMySQLRepository from "../../infrastructure/database/mysql/audit.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
// Inyección de dependencias
const budgetRepository = new BudgetMySQLRepository();
const transactionRepository = new TransactionMySQLRepository();
const auditRepository = new AuditMySQLRepository();
const budgetService = new BudgetService(budgetRepository, transactionRepository, auditRepository);
const budgetController = new BudgetController(budgetService);
 
const router = Router();
 
/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Crear o actualizar un presupuesto mensual por categoría
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amountLimit, month, year, categoryId]
 *             properties:
 *               amountLimit:
 *                 type: number
 *                 example: 2500
 *               month:
 *                 type: integer
 *                 example: 11
 *               year:
 *                 type: integer
 *                 example: 2026
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Presupuesto guardado exitosamente
 */
router.post("/", authMiddleware, budgetController.createOrUpdateBudget);
 
/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Obtener presupuestos del usuario y su estado de ejecución frente a gastos reales
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           example: 11
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2026
 *     responses:
 *       200:
 *         description: Lista de presupuestos con monto gastado y disponible
 */
router.get("/", authMiddleware, budgetController.getBudgetsByUserId);
 
/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Eliminar un presupuesto
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Presupuesto eliminado
 */
router.delete("/:id", authMiddleware, budgetController.deleteBudget);
 
export default router;