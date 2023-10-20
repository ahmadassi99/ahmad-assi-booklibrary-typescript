'use strict';
import {
  Model
} from 'sequelize';
interface BookAttributes {
  id: number;
  name: string;
  author: string;
  isbn: string;
  description:string;
};
module.exports = (sequelize: any, DataTypes:any) => {
  class book extends Model<BookAttributes> implements BookAttributes {

    id!: number;
    name!: string;
    author!: string;
    isbn!: string;
    description!: string;
    
  
    static associate(models:any) {

    }
  }
  book.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'book',
    freezeTableName:true
  });
  return book;
};