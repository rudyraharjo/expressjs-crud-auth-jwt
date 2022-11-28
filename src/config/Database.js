import { Sequelize } from "sequelize";

import dotenv from "dotenv";

dotenv.config();

const dbConnect = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION
});

export default dbConnect;