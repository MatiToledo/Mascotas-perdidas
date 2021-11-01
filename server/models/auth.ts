import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class Auth extends Model {}
Auth.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "Auth" }
);
