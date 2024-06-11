import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const Siswa = DB.define(
  "siswa",
  {
    nama_lengkap: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    tanggal_lahir: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    nama_ayah: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    nama_ibu: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    alamat: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    kelompok: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    desa: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    daerah: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    no_telp: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    foto: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
  }
);

export default Siswa;
