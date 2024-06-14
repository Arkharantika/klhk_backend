import { Op } from "sequelize";
import AllData from "../models/AllData.js";
import MstHardware from "../models/MstHardware.js";
import RawGPA from "../models/RawGPA.js";
import FotoModel from "../models/FotoModel.js";
import path from "path";
import fs from "fs";

export const getHardwares = async (req, res) => {
  try {
    const Hardwares = await MstHardware.findAll({
      // attributes: ["id", "name", "email", "role"],
    });
    res.json(Hardwares);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getSpecificHardware = async (req, res) => {
  try {
    const response = await MstHardware.findOne({
      where: {
        kd_hardware: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllData = async (req, res) => {
  const { startDate, endDate } = req.body;
  const newStart = req.body.startDate.replace("T", " ");
  const newEnd = req.body.endDate.replace("T", " ");
  console.log("new : ", newStart, newEnd);
  console.log(req.body);
  try {
    const response = await AllData.findAll({
      where: {
        kd_hardware: req.params.id,
        tlocal: {
          // [Op.between]: [newStart, newEnd],
          [Op.between]: [startDate, endDate],
        },
      },
    });
    // console.log("result : ", response.data);
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const getChartData = async (req, res) => {
  const { startDate, endDate, sensor } = req.body;
  try {
    const response = await AllData.findAll({
      where: {
        kd_hardware: req.params.id,
        kd_sensor: sensor,
        tlocal: {
          // [Op.between]: [newStart, newEnd],
          [Op.between]: [startDate, endDate],
        },
      },
    });
    console.log("result : ", response.data);
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const getLatestData = async (req, res) => {
  try {
    const response = await AllData.findOne({
      where: {
        kd_hardware: req.params.id,
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const infoDahsboard = async (req, res) => {
  try {
    const response = await AllData.findOne({
      where: {
        kd_hardware: req.params.id,
      },
      order: [["createdAt", "DESC"]],
    });

    const hardwarenya = await MstHardware.findOne({
      where: {
        kd_hardware: req.params.id,
      },
    });

    res.json({
      datawoy: response,
      hardwarewoy: hardwarenya,
    });
  } catch (error) {
    res.json(error);
  }
};

export const dashboardGPA = async (req, res) => {
  try {
    const response = await RawGPA.findAll({
      order: [["tlocal", "DESC"]],
      limit: 50,
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const MiniDashboardInfo = async (req, res) => {
  try {
    const total_aktif = await MstHardware.count({
      where: {
        condition: 1,
      },
    });
    const total_mati = await MstHardware.count({
      where: {
        condition: 0,
      },
    });
    const response = { aktif: total_aktif, mati: total_mati };
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const updateHardware = async (req, res) => {
  // return res.json(req.params.id);
  const {
    pos_name,
    location,
    latitude,
    longitude,
    no_gsm,
    kd_provinsi,
    kd_kabupaten,
    kd_kecamatan,
    kd_desa,
    no_pos,
    elevasi,
    k1,
    k2,
    k3,
    k_tma,
    sed_catchment_area,
    sed_conversion,
  } = req.body;

  try {
    const response = await MstHardware.findOne({
      where: {
        kd_hardware: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    // return res.json(req.files);
    let fileName = "";
    if (req.files === null) {
      fileName = response.foto_pos;
      // return file
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      // return res.json("kentang !!");
      const fileName = req.body.pos_name + ext;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      try {
        const filepath = `./public/images/${response.foto_pos}`;
        fs.unlinkSync(filepath);
      } catch (error) {
        console.log(error);
      }

      file.mv(`./public/images/${fileName}`, async (err) => {
        await MstHardware.update(
          {
            foto_pos: fileName,
          },
          {
            where: {
              kd_hardware: req.params.id,
            },
          }
        );
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    try {
      await MstHardware.update(
        {
          pos_name: pos_name,
          location: location,
          latitude: latitude,
          longitude: longitude,
          no_gsm: no_gsm,
          kd_provinsi: kd_provinsi,
          kd_kabupaten: kd_kabupaten,
          kd_kecamatan: kd_kecamatan,
          kd_desa: kd_desa,
          no_pos: no_pos,
          elevasi: elevasi,
          k1: k1,
          k2: k2,
          k3: k3,
          k_tma: k_tma,
          sed_catchment_area: sed_catchment_area,
          sed_conversion: sed_conversion,
        },
        {
          where: {
            kd_hardware: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Pos Hardware Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const foto_show = async (req, res) => {
  const hardwarenya = await MstHardware.findOne({
    where: {
      kd_hardware: req.params.id,
    },
  });
  const { startDate, endDate } = req.body;
  if (startDate === "kentang" && endDate === "kentang") {
    try {
      const response = await FotoModel.findAll({
        where: {
          img_num: hardwarenya.cam,
        },
        order: [["createdAt", "DESC"]],
        limit: 6,
      });
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  } else {
    try {
      const response = await FotoModel.findAll({
        where: {
          img_num: hardwarenya.cam,
          createdAt: {
            // [Op.between]: [newStart, newEnd],
            [Op.between]: [startDate, endDate],
          },
        },
        order: [["createdAt", "DESC"]],
      });
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  }
};
