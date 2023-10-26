'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
;
module.exports = (sequelize, DataTypes) => {
    class rent_book extends sequelize_1.Model {
        static associate(models) {
        }
    }
    rent_book.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'rent_book',
        freezeTableName: true
    });
    return rent_book;
};
