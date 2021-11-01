import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connect";

export class Report extends Model {}
Report.init(
  {
    reporterName: DataTypes.STRING,
    reporterPhoneNumber: DataTypes.STRING,
    seenIn: DataTypes.STRING,
  },
  { sequelize, modelName: "Report" }
);
