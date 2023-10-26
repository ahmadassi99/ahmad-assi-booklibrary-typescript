'use strict';
import {
  Model
} from'sequelize';
interface Rent_bookAttributes{
  id:number;
};
module.exports = (sequelize:any, DataTypes:any) => {
  class rent_book extends Model<Rent_bookAttributes> implements Rent_bookAttributes {
   id!:number;
    static associate(models:any) {
    }
  }
  rent_book.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    }
  }, {
    sequelize,
    modelName: 'rent_book',
    freezeTableName:true
  });
  return rent_book;
};