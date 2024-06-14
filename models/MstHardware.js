import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const MstHardware = DB.define(
  "MstHardware",
  {
    kd_hardware: {
      type: DataTypes.STRING,
    },
    kd_logger: {
      type: DataTypes.INTEGER,
    },
    tlocal: {
      type: DataTypes.DATE,
    },
    tzone: {
      type: DataTypes.DOUBLE,
    },
    tsample: {
      type: DataTypes.DOUBLE,
    },
    condition: {
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    location: {
      type: DataTypes.STRING,
    },
    uid: {
      type: DataTypes.STRING,
    },
    buka_pintu: {
      type: DataTypes.INTEGER,
    },
    pos_name: {
      type: DataTypes.STRING,
    },
    k_tma: {
      type: DataTypes.DOUBLE,
    },
    foto_pos: {
      type: DataTypes.STRING,
    },
    no_gsm: {
      type: DataTypes.STRING,
    },
    kd_provinsi: {
      type: DataTypes.STRING,
    },
    kd_desa: {
      type: DataTypes.STRING,
    },
    kd_kecamatan: {
      type: DataTypes.STRING,
    },
    kd_kabupaten: {
      type: DataTypes.STRING,
    },
    no_pos: {
      type: DataTypes.STRING,
    },
    elevasi: {
      type: DataTypes.STRING,
    },
    sed_conversion: {
      type: DataTypes.DOUBLE,
    },
    sed_catchment_area: {
      type: DataTypes.DOUBLE,
    },
    cam: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "mst_hardware" }
);

export default MstHardware;
