import 'dotenv/config';
import { Sequelize } from "sequelize";
 
 
const rawHost = process.env.MYSQL_HOST;
const [host, portFromHost] = rawHost.split(":");
const port = Number(process.env.MYSQL_PORT || portFromHost || 3306);
const database = process.env.MYSQL_DB;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
 
const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: "mysql",
    logging: false
});
 
export const connectMysql = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("Connected to MySQL");
    } catch (error) {
        console.error("Error connecting to MySQL:", error);
        process.exit(1);
    }
};
 
export default sequelize;