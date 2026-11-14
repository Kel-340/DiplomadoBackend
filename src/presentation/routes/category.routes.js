import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import CategoryMySQLRepository from "../../infrastructure/database/mysql/category.mysql.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
 
// Inyección de dependencias
const categoryRepository = new CategoryMySQLRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);
 
const router = Router();
 
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías (del sistema y del usuario)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías de ingresos y egresos
 */
router.get("/", authMiddleware, categoryController.getCategories);
 
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría personalizada
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Freelance"
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: "INCOME"
 *               description:
 *                 type: string
 *                 example: "Ingresos por desarrollo de software"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 */
router.post("/", authMiddleware, categoryController.createCategory);
 
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar una categoría personalizada
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría actualizada
 */
router.put("/:id", authMiddleware, categoryController.updateCategory);
 
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría personalizada
 *     tags: [Categories]
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
 *         description: Categoría eliminada
 */
router.delete("/:id", authMiddleware, categoryController.deleteCategory);
 
export default router;