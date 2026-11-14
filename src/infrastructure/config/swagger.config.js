import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
 
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Gestión de Gastos e Ingresos",
            version: "1.0.0",
            description: "Documentación de la API para control de ingresos, egresos, presupuestos, monedas por fecha, reportes y auditorías"
        },
        servers: [
            { url: "http://localhost:3000/api/v1" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./src/presentation/routes/*.js"]
};
 
const swaggerSpec = swaggerJSDoc(options);
 
export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Documentación Swagger disponible en http://localhost:3000/api-docs");
};
 