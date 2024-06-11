import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const AllData = DB.define(
  "AllData",
  {
    kd_hardware: {
      type: DataTypes.STRING,
    },
    tlocal: {
      type: DataTypes.DATE,
    },
    waterlevel: {
      type: DataTypes.DOUBLE,
    },
    debit: {
      type: DataTypes.DOUBLE,
    },
    tss: {
      type: DataTypes.DOUBLE,
    },
    device_temp: {
      type: DataTypes.DOUBLE,
    },
    rainfall: {
      type: DataTypes.DOUBLE,
    },
    battery: {
      type: DataTypes.DOUBLE,
    },
    sedimentasi: {
      type: DataTypes.DOUBLE,
    },
  },
  { tableName: "all_data" }
);

export default AllData;
