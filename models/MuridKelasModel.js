import { Sequelize } from "sequelize";
import DB from "../config/Database.js";
import Siswa from "./SiswaModel.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const MuridKelas = DB.define(
  "murid_kelas",
  {
    id_kelas: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);
Siswa.hasMany(MuridKelas);
MuridKelas.belongsTo(Siswa);
Kelas.hasMany(MuridKelas);
MuridKelas.belongsTo(Kelas);

export default MuridKelas;
