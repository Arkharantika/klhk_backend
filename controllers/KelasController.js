// ----------------------------------------------------------
//                  === CLASS MANAGEMENT ===
// ----------------------------------------------------------

import { where } from "sequelize";
import Kelas from "../models/KelasModel.js";
import MuridKelas from "../models/MuridKelasModel.js";
import Siswa from "../models/SiswaModel.js";

// >>> CREATE NEW CLASS
export const CreateClass = async (req, res) => {
  const { nama_kelas, deskripsi } = req.body;
  try {
    const response = await Kelas.create({
      nama_kelas: nama_kelas,
      deskripsi: deskripsi,
    });
    const listnya = await Siswa.findAll();
    listnya.forEach((student) => {
      MuridKelas.create({
        kelaId: response.id,
        siswaId: student.id,
      });
    });
    return res.status(200).json("class berhasil dibuat");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// >>> GET ALL CLASSESS
export const getClass = async (req, res) => {
  try {
    const users = await Kelas.findAll({
      //   attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// >>> GET SPECIFIC CLASS
export const getSpecificClass = async (req, res) => {
  try {
    const response = await Kelas.findOne({
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

// >>> GET DAFTAR MURID YANG BELUM KEDAFTAR DALAM KELAS
export const DaftarMuridYangBelumKelas = async (req, res) => {
  try {
    const response = await Siswa.findAll({
      include: [
        {
          model: MuridKelas,
          where: {
            kelaId: req.params.id,
            //   siswaId: null,
            status: null,
          },
          // required: true,
        },
      ],
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

// >>> GET DAFTAR MURID YANG SUDAH ADA DALAM KELAS
export const DaftarMuridSudahKelas = async (req, res) => {
  try {
    const response = await Siswa.findAll({
      include: [
        {
          model: MuridKelas,
          where: {
            kelaId: req.params.id,
            //   siswaId: null,
            status: "aktif",
          },
          // required: true,
        },
      ],
    });
    res.json(response);
  } catch (error) {
    res.json(error);
  }
};

export const MasukanMuridnya = async (req, res) => {
    const {siswaId,kelaId} = req.body
  try {
    const response = await MuridKelas.update(
      {
        status: "aktif",
      },
      {
        where: {
          siswaId: siswaId,
          kelaId: kelaId,
        },
      }
    );
    res.status(200).json({ msg: "Murid Kelas Berhasil Ditambah !" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// export const CheckMuridDalamKelas = async (req, res) => {
//   const { siswaId, kelaId } = req.body;
//   try {
//     const response = await MuridKelas.findOne({
//       where: {
//         siswaId: siswaId,
//         kelaId: kelaId,
//       },
//     });
//     if (response) res.json("ketemu!");
//     else res.json(response);
//   } catch (error) {}
// };
