import { Sequelize } from "sequelize";
import dbConnect from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Schedule = dbConnect.define('schedule', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time_start: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time_finish: {
        type: DataTypes.STRING,
    },
    quota: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATEONLY,
    },
}, {
    freezeTableName: true
});

export default Schedule;