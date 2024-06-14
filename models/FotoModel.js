import { Sequelize } from "sequelize";
import DB from "../config/Database.js";

const { DataTypes } = Sequelize;

const FotoModel = DB.define(
  "FotoModel",
  {
    img_name: {
      type: DataTypes.STRING,
    },
    img_num: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "image_ftp" }
);

export default FotoModel;
