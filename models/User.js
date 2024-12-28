import { DataTypes, Model } from "sequelize";
import sequelize from "../utilities/sequelize.js";
// Define the User model
class User extends Model {
}
User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
    },
    otpExpiresAt: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ipAddress: {
        type: DataTypes.STRING,
    },
    userAgent: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});
export default User;
