import { Sequelize } from "sequelize";
import dbConnect from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Users = dbConnect.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        unique: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Users.associate = function (models) {
//     // associations can be defined here
//     Users.hasOne(models.Roles)
// };

export default Users;