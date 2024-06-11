import { Sequelize } from "sequelize";
import DB from "../config/Database.js";
import Siswa from "./SiswaModel.js";
import MuridKelas from "./MuridKelasModel.js";
import Kelas from "./KelasModel.js";

const { DataTypes } = Sequelize;

const Presensi = DB.define(
  "presensi",
  {
    id_kelas: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    tanggal: {
      type: DataTypes.DATE,
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

Siswa.hasMany(Presensi);
Presensi.belongsTo(Siswa);
Kelas.hasMany(Presensi);
Presensi.belongsTo(Kelas);

export default Presensi;
