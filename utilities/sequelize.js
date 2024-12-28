import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
//Create an Instance of Sequelize ORM
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql', // Use 'mysql' for both MySQL and MariaDB
    logging: true
});
//Export Sequelize Configs
export default sequelize;
