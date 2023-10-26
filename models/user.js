'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
;
module.exports = (sequelize, DataTypes) => {
    class user extends sequelize_1.Model {
        static associate(models) {
            user.belongsToMany(models.book, {
                through: 'rent_book'
            });
        }
    }
    user.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'user',
        freezeTableName: true
    });
    return user;
};
