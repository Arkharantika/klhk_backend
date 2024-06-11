// import Users from "../models/UserModel.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import Siswa from "../models/SiswaModel.js";

// >>> CREATE NEW SISWA
export const createSiswa = async (req, res) => {
  const {
    nama_lengkap,
    tempat_lahir,
    tanggal_lahir,
    gender,
    nama_ayah,
    nama_ibu,
    alamat,
    kelompok,
    desa,
    daerah,
    no_telp,
  } = req.body;
  if (req.alldata.role === "admin") {
    try {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = req.body.nama_lengkap + ext;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
          await Siswa.create({
            nama_lengkap: nama_lengkap,
            tanggal_lahir: tanggal_lahir,
            tempat_lahir: tempat_lahir,
            nama_ayah: nama_ayah,
            nama_ibu: nama_ibu,
            gender: gender,
            kelompok: kelompok,
            desa: desa,
            daerah: daerah,
            alamat: alamat,
            no_telp: no_telp,
            foto: fileName,
          });
          res.status(201).json({ msg: "Siswa Created Successfuly" });
        } catch (error) {
          console.log(error.message);
        }
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "Akses terlarang" });
  }
};

// >>> GET ALL SISWA
export const getSiswa = async (req, res) => {
  try {
    const response = await Siswa.findAll({
      //   attributes: ["id", "nama_lengkap", "kelompok", "gender"],
    });
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

// >>> GET SPECIFIC SISWA
export const getSpecificSiswa = async (req, res) => {
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
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

// >>> UPDATE SPECIFIC SISWA
export const updateSiswa = async (req, res) => {
  if (req.alldata.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden Bro" });
  }
  const {
    nama_lengkap,
    tanggal_lahir,
    tempat_lahir,
    gender,
    nama_ayah,
    nama_ibu,
    alamat,
    kelompok,
    desa,
    daerah,
    no_telp,
  } = req.body;
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    let fileName = "";
    if (req.files === null) {
      fileName = response.foto;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      const fileName = req.body.nama_lengkap + ext;
      const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid Images" });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB" });

      try {
        const filepath = `./public/images/${response.foto}`;
        fs.unlinkSync(filepath);
      } catch (error) {
        console.log(error);
      }

      file.mv(`./public/images/${fileName}`, async (err) => {
        await Siswa.update(
          {
            foto: fileName,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    try {
      await Siswa.update(
        {
          nama_lengkap: nama_lengkap,
          tanggal_lahir: tanggal_lahir,
          tempat_lahir: tempat_lahir,
          gender: gender,
          nama_ayah: nama_ayah,
          nama_ibu: nama_ibu,
          alamat: alamat,
          kelompok: kelompok,
          desa: desa,
          daerah: daerah,
          no_telp: no_telp,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "Product Updated Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// >>> HAPUS SISWA
export const deleteSiswa = async (req, res) => {
  try {
    const response = await Siswa.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "No Data Found" });
    }
    await Siswa.destroy({
      where: {
        id: req.params.id,
      },
    });
    try {
      const filepath = `./public/images/${response.foto}`;
      fs.unlinkSync(filepath);
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ msg: "Siswa deleted successfuly" });
  } catch (error) {}
};
