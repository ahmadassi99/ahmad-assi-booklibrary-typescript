'use strict';
import { UUID } from 'crypto';
import {
  Model
} from'sequelize';
interface UserAttributes{
  id:number;
  first_name:string;
  last_name:string;
  password:string;
  email:string;
};
module.exports = (sequelize:any, DataTypes:any) => {
  class user extends Model<UserAttributes> implements UserAttributes {
   id!:number;
   first_name!:string;
   last_name!:string;
   password!:string;
   email!:string;
  
    static associate(models:any) {
      user.belongsToMany(models.book,{
        through:'rent_book'
      });
    }
  }
  user.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    first_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    last_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    password:{
       type:DataTypes.STRING,
       allowNull:false,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'user',
    freezeTableName:true
  });
  return user;
};