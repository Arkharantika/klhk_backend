import XLSX from "xlsx-js-style";

import { Op, literal, fn, col } from "sequelize";
import AllData from "../models/AllData.js";
import path from "path";
import fs from "fs";
import MstHardware from "../models/MstHardware.js";

export const textExcel = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log("startDate: ", startDate);
  console.log("endDate: ", endDate);

  const identity = await MstHardware.findOne({
    where: {
      kd_hardware: req.params.id,
    },
  });

  // Define the default header
  const defaultHeader = [
    ["NAMA IPPKH/PPKH", , identity.pos_name],
    ["NOMOR IPPKH/PPKH", ,],
    ["PROVINSI", , identity.kd_provinsi],
    ["KABUPATEN", , identity.kd_kabupaten],
    ["KECAMATAN", , identity.kd_kecamatan],
    ["DESA", , identity.kd_desa],
    ["DAS", ,],
    ["KODE HARDWARE", , identity.kd_hardware],
    ["LOKASI", , identity.location],
    ["KOORDINAT", , "lS : " + identity.latitude],
    ["", , "LU : " + identity.longitude],
    ["TAHUN PEMASANGAN ALAT", ,],
    ["TAHUN DATA", ,],
    [],
    ["No", "Time", "Debit", , , "Rain", ,],
    [
      "",
      "",
      "Average",
      "Max Debit",
      "Min Debit",
      "Rainfall",
      "Rainy days",
      "Sedimentasi",
    ],
  ];

  //   >>> PER HOUR
  // Query to get the average water level per hour
  //   const theData = await AllData.findAll({
  //     attributes: [
  //       [literal('DATE_FORMAT(tlocal, "%Y-%m-%d %H:00:00")'), "hour"], // Format to hour
  //       [fn("AVG", col("debit")), "average_debit"], // Average water level
  //     ],
  //     where: {
  //       kd_hardware: req.params.id,
  //       //   tlocal: {
  //       //     [Op.between]: [new Date(startDate), new Date(endDate)],
  //       //   },
  //     },
  //     group: [literal('DATE_FORMAT(tlocal, "%Y-%m-%d %H:00:00")')], // Group by hour
  //     order: [[literal('DATE_FORMAT(tlocal, "%Y-%m-%d %H:00:00")'), "ASC"]],
  //   });

  //   >>> PER DAY
  //   const theData = await AllData.findAll({
  //     attributes: [
  //       [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "day"], // Format to day
  //       [fn("AVG", col("debit")), "average_debit"], // Average debit
  //     ],
  //     where: {
  //       kd_hardware: req.params.id,
  //       tlocal: {
  //         [Op.between]: [new Date(startDate), new Date(endDate)],
  //       },
  //     },
  //     group: [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")')], // Group by day
  //     order: [[literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "ASC"]],
  //   });

  // PER MONTH
  const theData = await AllData.findAll({
    attributes: [
      [literal('DATE_FORMAT(tlocal, "%Y-%m")'), "month"], // Format to year-month
      [fn("AVG", col("debit")), "average_debit"], // Average debit
      [fn("AVG", col("rainfall")), "average_rainfall"], // Average debit
      [fn("AVG", col("sedimentasi")), "average_sedimen"], // Average debit
      [fn("MAX", col("debit")), "max_debit"], // Maximum debit
      [fn("MIN", col("debit")), "min_debit"], // Maximum debit
      [
        literal("COUNT(DISTINCT IF(rainfall > 0, DATE(tlocal), NULL))"),
        "rainy_days",
      ],
    ],
    where: {
      kd_hardware: req.params.id,
      //   tlocal: {
      //     [Op.between]: [new Date(startDate), new Date(endDate)],
      //   },
    },
    group: [literal('DATE_FORMAT(tlocal, "%Y-%m")')], // Group by month
    order: [[literal('DATE_FORMAT(tlocal, "%Y-%m")'), "ASC"]],
  });

  // Convert the data to an array of arrays
  const dataArray = theData.map((item, index) => [
    index + 1,
    item.getDataValue("month"),
    item.getDataValue("average_debit"),
    item.getDataValue("max_debit"),
    item.getDataValue("min_debit"),
    item.getDataValue("average_rainfall"),
    item.getDataValue("rainy_days"),
    item.getDataValue("average_sedimen"),
  ]);

  // Combine defaultHeader and dataArray
  const combinedData = [...defaultHeader, ...dataArray];
  // Convert combinedData to a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(combinedData);
  // Define the merge range for header
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
    { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 1 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 1 } },
    { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
    { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } },
    { s: { r: 10, c: 0 }, e: { r: 10, c: 1 } },
    { s: { r: 11, c: 0 }, e: { r: 11, c: 1 } },
    { s: { r: 14, c: 0 }, e: { r: 13, c: 0 } },
    { s: { r: 14, c: 1 }, e: { r: 13, c: 1 } },
    { s: { r: 13, c: 2 }, e: { r: 13, c: 4 } },
    { s: { r: 13, c: 5 }, e: { r: 13, c: 6 } },
  ];

  //   // Center the merged cell
  //   if (!worksheet["C14"]) worksheet["C14"] = {}; // Initialize cell object if not present
  //   worksheet["C14"].s = {
  //     alignment: {
  //       horizontal: "center",
  //       vertical: "center",
  //     },
  //   };

  // Define a common border style
  const borderStyle = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };

  // Apply the border style to each cell in the merged area
  const applyBorderStyle = (cell) => {
    if (!cell) cell = {}; // Initialize cell if not present
    cell.s = {
      border: borderStyle,
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    };
    return cell;
  };

  const cellsToBorder = [
    "A14",
    "A15",
    "B14",
    "B15",
    "C14",
    "C15",
    "D14",
    "D15",
    "E14",
    "E15",
    "F14",
    "G14",
    "H14",
    "I14",
    "F15",
    "G15",
    "H15",
  ];
  cellsToBorder.forEach((cell) => {
    worksheet[cell] = applyBorderStyle(worksheet[cell]);
  });
  // Apply the border and alignment to the merged cells
  //   worksheet["A14"] = applyBorderStyle(worksheet["A14"]);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create a buffer to send the file as a response
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  // Set response headers
  res.setHeader("Content-Disposition", 'attachment; filename="output.xlsx"');
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  // Send the buffer as a response
  res.send(buffer);
};