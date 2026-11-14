import { Router } from "express";
import TransactionController from "../controllers/transaction.controller.js";
import TransactionService from "../../application/use-cases/transaction.service.js";
import TransactionMySQLRepository from "../../infrastructure/database/mysql/transaction.mysql.repository.js";
import CurrencyMongoRepository from "../../infrastructure/database/mongo/currency.mongo.repository.js";
import CategoryMySQLRepository from "../../infrastructure/database/mysql/category.mysql.repository.js";
import BudgetMySQLRepository from "../../infrastructure/database/mysql/budget.mysql.repository.js";
import AuditMySQLRepository from "../../infrastructure/database/mysql/audit.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
// Inyección de dependencias
const transactionRepository = new TransactionMySQLRepository();
const currencyRepository = new CurrencyMongoRepository();
const categoryRepository = new CategoryMySQLRepository();
const budgetRepository = new BudgetMySQLRepository();
const auditRepository = new AuditMySQLRepository();
 
const transactionService = new TransactionService(
    transactionRepository,
    currencyRepository,
    categoryRepository,
    budgetRepository,
    auditRepository
);
const transactionController = new TransactionController(transactionService);
 
const router = Router();
 
/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Registrar un nuevo ingreso o egreso (vinculado al tipo de cambio de la fecha)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, categoryId]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: "EXPENSE"
 *               amount:
 *                 type: number
 *                 example: 100
 *               currency:
 *                 type: string
 *                 example: "USD"
 *               description:
 *                 type: string
 *                 example: "Pago de licencia de software"
 *               date:
 *                 type: string
 *                 example: "2026-11-08"
 *               categoryId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Transacción creada y convertida con el tipo de cambio del día
 */
router.post("/", authMiddleware, transactionController.createTransaction);
 
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Obtener todos los ingresos y egresos del usuario autenticado
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transacciones del usuario
 */
router.get("/", authMiddleware, transactionController.getTransactionsByUserId);
 
/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Actualizar una transacción existente
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               date:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transacción actualizada
 */
router.put("/:id", authMiddleware, transactionController.updateTransaction);
 
/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Eliminar una transacción
 *     tags: [Transactions]
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
 *         description: Transacción eliminada exitosamente
 */
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);
 
export default router;