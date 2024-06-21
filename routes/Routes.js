import express from "express";

// >>> IMPORT THE CONTROLLERS
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../controllers/AuthController.js";
import { refreshToken } from "../controllers/RefreshTokenController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { getUsers } from "../controllers/UserController.js";
import {
  createSiswa,
  deleteSiswa,
  getSiswa,
  getSpecificSiswa,
  updateSiswa,
} from "../controllers/SiswaController.js";
import {
  CreateClass,
  DaftarMuridSudahKelas,
  DaftarMuridYangBelumKelas,
  MasukanMuridnya,
  getClass,
  getSpecificClass,
} from "../controllers/KelasController.js";
import {
  createNewAbsen,
  isiKehadiran,
  listPresensi,
  showAfterCreate,
} from "../controllers/PresensiController.js";
import {
  kelasIndividu,
  percentageKelas,
  statKelas,
  statPerson,
  statPersonKelas,
} from "../controllers/StatistikController.js";
import {
  MiniDashboardInfo,
  dashboardGPA,
  foto_show,
  getAllData,
  getChartData,
  getHardwares,
  getLatestData,
  getSpecificHardware,
  infoDahsboard,
  updateHardware,
} from "../controllers/HardwareController.js";

import {
  harianExcel,
  textExcel,
  // trySheet
} from "../controllers/ExcelController.js";

// >>> DEFINE ROUTER FROM EXPRESS
const router = express.Router();

// >>> FOR AUTHENTICATION
router.get("/token", refreshToken);
router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.delete("/logout", LogoutUser);

// >>> FOR USER MANAGEMENT
router.get("/users", VerifyToken, getUsers);

// >>> FOR SISWA
router.post("/siswa", VerifyToken, createSiswa);
router.get("/siswa", getSiswa);
router.get("/siswa/:id", getSpecificSiswa);
router.patch("/siswa/:id", VerifyToken, updateSiswa);
router.delete("/siswa/:id", deleteSiswa);

// >>> FOR CLASS
router.post("/kelas", CreateClass);
router.get("/kelas", getClass);
router.get("/kelas/:id", getSpecificClass);
router.get("/muridkelas/:id", DaftarMuridYangBelumKelas);
router.get("/listmuridkelas/:id", DaftarMuridSudahKelas);
router.patch("/masukanmurid", MasukanMuridnya);
// router.post("/checkmuridkelas", CheckMuridDalamKelas);

// >>> FOR PRESENSI
router.post("/checkuntukabsen", createNewAbsen);
router.get("/showafter/:id/:datenya", showAfterCreate);
router.patch("/isipresensi", isiKehadiran);
router.get("/daftarpresensi/:id", listPresensi);

// >>> FOR STATISTIK
router.post("/statkelas", statKelas);
router.post("/statperson", statPerson);
router.post("/percentkelas", percentageKelas);
router.get("/cekkelas/:id", kelasIndividu);
router.post("/statperson/:id/:kelasnya", statPersonKelas);

// >>> FOR HARDWARES
router.get("/hardwares", getHardwares);
router.get("/hardware/:id", getSpecificHardware);
router.post("/hardware/:id", getAllData);
router.get("/latestdata/:id", getLatestData);
router.get("/dashboardgpa", dashboardGPA);
router.get("/dashboardinfo", MiniDashboardInfo);
router.post("/updatehardware/:id", updateHardware);
router.get("/infodashboard/:id", infoDahsboard);
router.post("/getfoto/:id", foto_show);

// >>> FOR EXPORTS EXCEL
router.post("/exportexcel/:id", textExcel);
router.post("/exportharian/:id", harianExcel);
// router.post("/trysheet/:id", trySheet);

export default router;
