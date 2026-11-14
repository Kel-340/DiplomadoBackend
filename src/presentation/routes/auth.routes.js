import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../../application/use-cases/auth.service.js";
import UserMongoRepository from "../../infrastructure/database/mongo/user.mongo.repository.js";
import AuditMySQLRepository from "../../infrastructure/database/mysql/audit.mysql.repository.js";
 
// Inyección de dependencias
const userRepository = new UserMongoRepository();
const auditRepository = new AuditMySQLRepository();
const authService = new AuthService(userRepository, auditRepository);
const authController = new AuthController({ authService });
 
const router = Router();
 
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Perez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 default: user
 *               baseCurrency:
 *                 type: string
 *                 example: "BOB"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en la solicitud o correo duplicado
 */
router.post("/register", authController.register);
 
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secret123"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el token JWT
 *       400:
 *         description: Falta email o contraseña
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", authController.login);
 
export default router;
 