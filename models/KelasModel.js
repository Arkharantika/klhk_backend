import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const Kelas = DB.define(
  "kelas",
  {
    nama_kelas: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    created_by: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    deskripsi: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

export default Kelas;
