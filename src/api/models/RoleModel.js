import { Sequelize } from "sequelize";
import dbConnect from "../../config/Database.js";

const { DataTypes } = Sequelize;

const Roles = dbConnect.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    freezeTableName: true
});

// Roles.associate = function (models) {
//     // associations can be defined here
//     Roles.belongsTo(models.Users)
// };
export default Roles;