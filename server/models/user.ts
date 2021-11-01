import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class User extends Model {}
User.init(
  {
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "User" }
);
