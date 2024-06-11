import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const RawGPA = DB.define(
  "RawGPA",
  {
    tlocal: {
        type: DataTypes.DATE,
      },
      kd_hardware: {
        type: DataTypes.STRING,
      },
      kd_sensor: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.DOUBLE,
      },
      value_aktual_or_sample: {
        type: DataTypes.DOUBLE,
      },
      level0: {
        type: DataTypes.DOUBLE,
      },
      level1: {
        type: DataTypes.DOUBLE,
      },
      level2: {
        type: DataTypes.DOUBLE,
      },
      level3: {
        type: DataTypes.DOUBLE,
      },
      level4: {
        type: DataTypes.DOUBLE,
      },
      alarm_status: {
        type: DataTypes.INTEGER,
      },
      alarm_setting: {
        type: DataTypes.INTEGER,
      },
  },
  { tableName: "trs_raw_d_gpa" }
);

export default RawGPA;
