import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class Pet extends Model {}
Pet.init(
  {
    petName: DataTypes.STRING,
    petPhoto: DataTypes.STRING,
    petOwnerEmail: DataTypes.STRING,
    petDescription: DataTypes.STRING,
    petUbication: DataTypes.STRING,
    lastlocationLat: DataTypes.FLOAT,
    lastlocationLng: DataTypes.FLOAT,
  },
  { sequelize, modelName: "Pet" }
);
