import XLSX from "xlsx-js-style";
import ExcelJS from "exceljs";

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
    ["NOMOR IPPKH/PPKH", , identity.no_pos],
    ["PROVINSI", , identity.kd_provinsi],
    ["KABUPATEN", , identity.kd_kabupaten],
    ["KECAMATAN", , identity.kd_kecamatan],
    ["DESA", , identity.kd_desa],
    ["DAS", ,],
    ["KODE HARDWARE", , identity.kd_hardware],
    ["LOKASI", , identity.location],
    ["KOORDINAT", , "LS : " + identity.latitude],
    ["", , "LU : " + identity.longitude],
    ["TAHUN PEMASANGAN ALAT", ,],
    ["TAHUN DATA", ,],
    ["No", "Waktu", "Debit", , , "Hujan", , "sedimentasi"],
    [
      "",
      "",
      "Rata-rata",
      "Max Debit",
      "Min Debit",
      "Curah Hujan",
      "Jumlah Hari Hujan",
      "",
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
    { s: { r: 13, c: 7 }, e: { r: 14, c: 7 } },
  ];

  const borderStyle = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };
  // Center the merged cell
  if (!worksheet["A14"]) worksheet["A14"] = {}; // Initialize cell object if not present
  worksheet["A14"].s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    border: borderStyle,
  };
  if (!worksheet["B14"]) worksheet["B14"] = {}; // Initialize cell object if not present
  worksheet["B14"].s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };
  if (!worksheet["C14"]) worksheet["C14"] = {}; // Initialize cell object if not present
  worksheet["C14"].s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };
  if (!worksheet["F14"]) worksheet["F14"] = {}; // Initialize cell object if not present
  worksheet["F14"].s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };
  if (!worksheet["H14"]) worksheet["H14"] = {}; // Initialize cell object if not present
  worksheet["H14"].s = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Optional: set content for the merged cell
  //   worksheet["A14"].v = "Merged Cell Content";

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

// >> MAIN CODE (USED ACTUAL NOW)
// const getMonthName = (monthNumber) => {
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   return months[parseInt(monthNumber, 10) - 1]; // Convert "MM" to an index (0-11)
// };

// export const harianExcel = async (req, res) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Interval Pengiriman");
//   const worksheet2 = workbook.addWorksheet("Average Per Jam");

//   const { startDate, endDate, requestnya } = req.body;

//   try {
//     const identity = await MstHardware.findOne({
//       where: {
//         kd_hardware: req.params.id,
//       },
//     });

//     if (!identity) {
//       return res.status(404).send("Hardware not found");
//     }

//     const theData = await AllData.findAll({
//       where: {
//         kd_hardware: req.params.id,
//         tlocal: {
//           [Op.between]: [new Date(startDate), new Date(endDate)],
//         },
//       },
//       order: [["tlocal", "ASC"]],
//     });

//     const defaultHeader = [
//       ["NAMA IPPKH/PPKH", identity.pos_name || ""],
//       ["NOMOR IPPKH/PPKH", identity.no_pos || ""],
//       ["PROVINSI", identity.kd_provinsi || ""],
//       ["KABUPATEN", identity.kd_kabupaten || ""],
//       ["KECAMATAN", identity.kd_kecamatan || ""],
//       ["DESA", identity.kd_desa || ""],
//       ["DAS", ""],
//       ["KODE HARDWARE", identity.kd_hardware || ""],
//       ["LOKASI", identity.location || ""],
//       ["KOORDINAT", "LS : " + (identity.latitude || "")],
//       ["", "LU : " + (identity.longitude || "")],
//       ["TAHUN PEMASANGAN ALAT", ""],
//       ["TAHUN DATA", ""],
//       ["", ""],
//     ];

//     defaultHeader.forEach((row) => {
//       worksheet.addRow(row);
//     });

//     const formatDateTime = (date) => {
//       const options = {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       };
//       return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
//     };

//     let previousDate = null;
//     let currentRow = [];
//     let isFirstDateRowAdded = false;

//     const statsByDate = {};

//     // Calculate max and min for the requested data type (debit, battery, temperature, etc.)
//     theData.forEach((data) => {
//       const date = formatDateTime(data?.tlocal).split(" ")[0];
//       const value = data[requestnya]; // Use dynamic field

//       if (!statsByDate[date]) {
//         statsByDate[date] = {
//           max: value,
//           maxTimestamp: formatDateTime(data.tlocal),
//           min: value,
//           minTimestamp: formatDateTime(data.tlocal),
//         };
//       } else {
//         if (value > statsByDate[date].max) {
//           statsByDate[date].max = value;
//           statsByDate[date].maxTimestamp = formatDateTime(data.tlocal);
//         }
//         if (value < statsByDate[date].min) {
//           statsByDate[date].min = value;
//           statsByDate[date].minTimestamp = formatDateTime(data.tlocal);
//         }
//       }
//     });

//     for (let i = 0; i < theData.length; i++) {
//       const currentDate = formatDateTime(theData[i]?.tlocal);

//       if (
//         previousDate &&
//         currentDate.split(" ")[0] !== previousDate.split(" ")[0]
//       ) {
//         while (currentRow.length < 20) {
//           currentRow.push("");
//         }

//         worksheet.addRow(currentRow);
//         currentRow = [];

//         worksheet.addRow(new Array(20).fill(""));

//         const date = currentDate.split(" ")[0];
//         const stats = statsByDate[date];
//         worksheet.addRow([
//           "tanggal " + date,
//           `Max ${requestnya}: ` + stats.max,
//           "Timestamp: " + stats.maxTimestamp,
//           `Min ${requestnya}: ` + stats.min,
//           "Timestamp: " + stats.minTimestamp,
//           ...new Array(15).fill(""),
//         ]);
//         worksheet.addRow([
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//         ]);
//       } else if (!isFirstDateRowAdded) {
//         const date = currentDate.split(" ")[0];
//         const stats = statsByDate[date];
//         worksheet.addRow([
//           "tanggal " + date,
//           `Max ${requestnya}: ` + stats.max,
//           "Timestamp: " + stats.maxTimestamp,
//           `Min ${requestnya}: ` + stats.min,
//           "Timestamp: " + stats.minTimestamp,
//           ...new Array(15).fill(""),
//         ]);
//         worksheet.addRow([
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//           "Waktu",
//           requestnya,
//         ]);
//         isFirstDateRowAdded = true;
//       }

//       currentRow.push(currentDate || "", theData[i][requestnya] || "");

//       if (currentRow.length === 20) {
//         worksheet.addRow(currentRow);
//         currentRow = [];
//       }

//       previousDate = currentDate;
//     }

//     if (currentRow.length > 0) {
//       while (currentRow.length < 20) {
//         currentRow.push("");
//       }
//       worksheet.addRow(currentRow);
//     }

//     worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
//       const isEmptyRow = row.values.every(
//         (value) => value === null || value === ""
//       );
//       const isDefaultHeaderRow = rowNumber <= defaultHeader.length;
//       const isTanggalRow = row
//         .getCell(1)
//         .value?.toString()
//         .startsWith("tanggal");

//       if (!isEmptyRow && !isDefaultHeaderRow && !isTanggalRow) {
//         row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//           cell.border = {
//             top: { style: "thin" },
//             left: { style: "thin" },
//             bottom: { style: "thin" },
//             right: { style: "thin" },
//           };

//           if ([2, 4, 6, 8, 10, 12, 14, 16, 18, 20].includes(colNumber)) {
//             cell.fill = {
//               type: "pattern",
//               pattern: "solid",
//               fgColor: { argb: "FF87CEEB" },
//             };
//           }
//         });
//       }
//     });

//     // START SHEET 2

//     const theData2 = await AllData.findAll({
//       attributes: [
//         [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "day"], // Format to day
//         [literal('DATE_FORMAT(tlocal, "%H")'), "hour"], // Format to hour
//         [fn("AVG", col(requestnya)), `average_${requestnya}`], // Dynamic field based on requestnya
//       ],
//       where: {
//         kd_hardware: req.params.id,
//         tlocal: {
//           [Op.between]: [new Date(startDate), new Date(endDate)],
//         },
//       },
//       group: [
//         literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'),
//         literal('DATE_FORMAT(tlocal, "%H")'),
//       ], // Group by day and hour
//       order: [
//         [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "ASC"],
//         [literal('DATE_FORMAT(tlocal, "%H")'), "ASC"],
//       ],
//     });

//     // Organize data by day and hour
//     const groupedData = {};
//     theData2.forEach((item) => {
//       const day = item.getDataValue("day");
//       const hour = parseInt(item.getDataValue("hour"), 10);
//       const averageData = item.getDataValue(`average_${requestnya}`);

//       if (!groupedData[day]) {
//         groupedData[day] = Array(24).fill(null); // Initialize array for 24 hours
//       }
//       groupedData[day][hour] = averageData;
//     });
//     const borderStyle = {
//       top: { style: "thin" },
//       left: { style: "thin" },
//       bottom: { style: "thin" },
//       right: { style: "thin" },
//     };

//     // Color style for columns B, D, and F
//     const colorStyle = {
//       type: "pattern",
//       pattern: "solid",
//       fgColor: { argb: "FFFADFAD" },
//     };
//     defaultHeader.forEach((row) => {
//       const excelRow = worksheet2.addRow(row);
//       excelRow.eachCell({ includeEmpty: true }, (cell) => {});
//     });

//     let currentMonth = null;

//     // Add data rows (one row per day) with month separation and month name display
//     Object.keys(groupedData).forEach((day, index) => {
//       const rowData = [day, ...groupedData[day]];

//       // Calculate the daily average and add it as the last column
//       const dailySum = groupedData[day].reduce(
//         (acc, val) => acc + (val || 0),
//         0
//       );
//       const hourCount = groupedData[day].filter((val) => val !== null).length;
//       const dailyAvg = hourCount > 0 ? dailySum / hourCount : 0;

//       rowData.push(dailyAvg);

//       // Extract the month and year from the date (day)
//       const month = day.substring(0, 7); // 'YYYY-MM'
//       const year = day.substring(0, 4); // 'YYYY'
//       const monthName = getMonthName(day.substring(5, 7)); // Get the month name

//       // Insert the month name with the year if the month has changed
//       if (currentMonth !== month) {
//         if (currentMonth !== null) {
//           worksheet2.addRow([]); // Add an empty row to separate months
//         }
//         currentMonth = month; // Update the current month

//         // Insert a row with the month name and year (without borders)
//         worksheet2.addRow([`${monthName} ${year}`]);

//         const miniHeader = [
//           "Tanggal",
//           "00-01",
//           "01-02",
//           "02-03",
//           "03-04",
//           "04-05",
//           "05-06",
//           "06-07",
//           "07-08",
//           "08-09",
//           "09-10",
//           "10-11",
//           "11-12",
//           "12-13",
//           "13-14",
//           "14-15",
//           "15-16",
//           "16-17",
//           "17-18",
//           "18-19",
//           "19-20",
//           "20-21",
//           "21-22",
//           "22-23",
//           "23-24",
//           "Rata-rata",
//         ];

//         const headerRow = worksheet2.addRow(miniHeader);
//         headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//           cell.border = borderStyle;
//           if (
//             colNumber === 2 ||
//             colNumber === 4 ||
//             colNumber === 6 ||
//             colNumber === 8 ||
//             colNumber === 10 ||
//             colNumber === 12 ||
//             colNumber === 14 ||
//             colNumber === 16 ||
//             colNumber === 18 ||
//             colNumber === 20
//           ) {
//             cell.fill = colorStyle;
//           }
//         });
//       }

//       // Add the row for the current day with borders
//       const dataRow = worksheet2.addRow(rowData);
//       dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
//         cell.border = borderStyle;
//         // Apply color to columns B, D, and F (column numbers 2, 4, 6)
//         if (
//           colNumber === 2 ||
//           colNumber === 4 ||
//           colNumber === 6 ||
//           colNumber === 8 ||
//           colNumber === 10 ||
//           colNumber === 12 ||
//           colNumber === 14 ||
//           colNumber === 16 ||
//           colNumber === 18 ||
//           colNumber === 20
//         ) {
//           cell.fill = colorStyle;
//         }
//       });
//     });

//     // Adjust column widths (optional)
//     worksheet2.columns = [
//       { width: 15 }, // Tanggal
//       ...Array(24).fill({ width: 10 }), // Hours
//       { width: 15 }, // Rata-rata
//     ];

//     const buffer = await workbook.xlsx.writeBuffer();
//     const filename = `${requestnya}_data_harian.xlsx`;

//     // Expose the X-Filename header to the frontend
//     res.setHeader("Access-Control-Expose-Headers", "X-Filename");

//     // Set the custom header with the filename
//     res.setHeader("X-Filename", filename);
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );

//     // Send the file buffer
//     res.send(buffer);
//   } catch (err) {
//     console.error("Error creating Excel file:", err);
//     res.status(500).send("Error generating Excel file");
//   }
// };

// >> EXPERIMENTAL CODE TESTING
const getMonthName = (monthNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[parseInt(monthNumber, 10) - 1]; // Convert "MM" to an index (0-11)
};

export const harianExcel = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Interval Pengiriman");
  const worksheet2 = workbook.addWorksheet("Average Per Jam");
  const worksheet3 = workbook.addWorksheet("Bulanan");

  const { startDate, endDate, requestnya } = req.body;

  try {
    const identity = await MstHardware.findOne({
      where: {
        kd_hardware: req.params.id,
      },
    });

    if (!identity) {
      return res.status(404).send("Hardware not found");
    }

    const theData = await AllData.findAll({
      where: {
        kd_hardware: req.params.id,
        tlocal: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      order: [["tlocal", "ASC"]],
    });

    const defaultHeader = [
      ["NAMA IPPKH/PPKH", identity.pos_name || ""],
      ["NOMOR IPPKH/PPKH", identity.no_pos || ""],
      ["PROVINSI", identity.kd_provinsi || ""],
      ["KABUPATEN", identity.kd_kabupaten || ""],
      ["KECAMATAN", identity.kd_kecamatan || ""],
      ["DESA", identity.kd_desa || ""],
      ["DAS", ""],
      ["KODE HARDWARE", identity.kd_hardware || ""],
      ["LOKASI", identity.location || ""],
      ["KOORDINAT", "LS : " + (identity.latitude || "")],
      ["", "LU : " + (identity.longitude || "")],
      ["TAHUN PEMASANGAN ALAT", ""],
      ["TAHUN DATA", ""],
      ["", ""],
    ];

    defaultHeader.forEach((row) => {
      worksheet.addRow(row);
    });

    const formatDateTime = (date) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
    };

    let previousDate = null;
    let currentRow = [];
    let isFirstDateRowAdded = false;

    const statsByDate = {};

    // Calculate max and min for the requested data type (debit, battery, temperature, etc.)
    theData.forEach((data) => {
      const date = formatDateTime(data?.tlocal).split(" ")[0];
      const value = data[requestnya]; // Use dynamic field

      if (!statsByDate[date]) {
        statsByDate[date] = {
          max: value,
          maxTimestamp: formatDateTime(data.tlocal),
          min: value,
          minTimestamp: formatDateTime(data.tlocal),
        };
      } else {
        if (value > statsByDate[date].max) {
          statsByDate[date].max = value;
          statsByDate[date].maxTimestamp = formatDateTime(data.tlocal);
        }
        if (value < statsByDate[date].min) {
          statsByDate[date].min = value;
          statsByDate[date].minTimestamp = formatDateTime(data.tlocal);
        }
      }
    });

    for (let i = 0; i < theData.length; i++) {
      const currentDate = formatDateTime(theData[i]?.tlocal);

      if (
        previousDate &&
        currentDate.split(" ")[0] !== previousDate.split(" ")[0]
      ) {
        while (currentRow.length < 20) {
          currentRow.push("");
        }

        worksheet.addRow(currentRow);
        currentRow = [];

        worksheet.addRow(new Array(20).fill(""));

        const date = currentDate.split(" ")[0];
        const stats = statsByDate[date];
        worksheet.addRow([
          "tanggal " + date,
          `Max ${requestnya}: ` + stats.max,
          "Timestamp: " + stats.maxTimestamp,
          `Min ${requestnya}: ` + stats.min,
          "Timestamp: " + stats.minTimestamp,
          ...new Array(15).fill(""),
        ]);
        worksheet.addRow([
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
        ]);
      } else if (!isFirstDateRowAdded) {
        const date = currentDate.split(" ")[0];
        const stats = statsByDate[date];
        worksheet.addRow([
          "tanggal " + date,
          `Max ${requestnya}: ` + stats.max,
          "Timestamp: " + stats.maxTimestamp,
          `Min ${requestnya}: ` + stats.min,
          "Timestamp: " + stats.minTimestamp,
          ...new Array(15).fill(""),
        ]);
        worksheet.addRow([
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
          "Waktu",
          requestnya,
        ]);
        isFirstDateRowAdded = true;
      }

      currentRow.push(currentDate || "", theData[i][requestnya] || "");

      if (currentRow.length === 20) {
        worksheet.addRow(currentRow);
        currentRow = [];
      }

      previousDate = currentDate;
    }

    if (currentRow.length > 0) {
      while (currentRow.length < 20) {
        currentRow.push("");
      }
      worksheet.addRow(currentRow);
    }

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const isEmptyRow = row.values.every(
        (value) => value === null || value === ""
      );
      const isDefaultHeaderRow = rowNumber <= defaultHeader.length;
      const isTanggalRow = row
        .getCell(1)
        .value?.toString()
        .startsWith("tanggal");

      if (!isEmptyRow && !isDefaultHeaderRow && !isTanggalRow) {
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          if ([2, 4, 6, 8, 10, 12, 14, 16, 18, 20].includes(colNumber)) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF87CEEB" },
            };
          }
        });
      }
    });

    // START SHEET 2

    const theData2 = await AllData.findAll({
      attributes: [
        [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "day"], // Format to day
        [literal('DATE_FORMAT(tlocal, "%H")'), "hour"], // Format to hour
        [fn("AVG", col(requestnya)), `average_${requestnya}`], // Dynamic field based on requestnya
      ],
      where: {
        kd_hardware: req.params.id,
        tlocal: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      group: [
        literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'),
        literal('DATE_FORMAT(tlocal, "%H")'),
      ], // Group by day and hour
      order: [
        [literal('DATE_FORMAT(tlocal, "%Y-%m-%d")'), "ASC"],
        [literal('DATE_FORMAT(tlocal, "%H")'), "ASC"],
      ],
    });

    // Organize data by day and hour
    const groupedData = {};
    theData2.forEach((item) => {
      const day = item.getDataValue("day");
      const hour = parseInt(item.getDataValue("hour"), 10);
      const averageData = item.getDataValue(`average_${requestnya}`);

      if (!groupedData[day]) {
        groupedData[day] = Array(24).fill(null); // Initialize array for 24 hours
      }
      groupedData[day][hour] = averageData;
    });
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Color style for columns B, D, and F
    const colorStyle = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFADFAD" },
    };
    defaultHeader.forEach((row) => {
      const excelRow = worksheet2.addRow(row);
      excelRow.eachCell({ includeEmpty: true }, (cell) => {});
    });

    let currentMonth = null;

    // Add data rows (one row per day) with month separation and month name display
    Object.keys(groupedData).forEach((day, index) => {
      const rowData = [day, ...groupedData[day]];

      // Calculate the daily average and add it as the last column
      const dailySum = groupedData[day].reduce(
        (acc, val) => acc + (val || 0),
        0
      );
      const hourCount = groupedData[day].filter((val) => val !== null).length;
      const dailyAvg = hourCount > 0 ? dailySum / hourCount : 0;

      rowData.push(dailyAvg);

      // Extract the month and year from the date (day)
      const month = day.substring(0, 7); // 'YYYY-MM'
      const year = day.substring(0, 4); // 'YYYY'
      const monthName = getMonthName(day.substring(5, 7)); // Get the month name

      // Insert the month name with the year if the month has changed
      if (currentMonth !== month) {
        if (currentMonth !== null) {
          worksheet2.addRow([]); // Add an empty row to separate months
        }
        currentMonth = month; // Update the current month

        // Insert a row with the month name and year (without borders)
        worksheet2.addRow([`${monthName} ${year}`]);

        const miniHeader = [
          "Tanggal",
          "00-01",
          "01-02",
          "02-03",
          "03-04",
          "04-05",
          "05-06",
          "06-07",
          "07-08",
          "08-09",
          "09-10",
          "10-11",
          "11-12",
          "12-13",
          "13-14",
          "14-15",
          "15-16",
          "16-17",
          "17-18",
          "18-19",
          "19-20",
          "20-21",
          "21-22",
          "22-23",
          "23-24",
          "Rata-rata",
        ];

        const headerRow = worksheet2.addRow(miniHeader);
        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          cell.border = borderStyle;
          if (
            colNumber === 2 ||
            colNumber === 4 ||
            colNumber === 6 ||
            colNumber === 8 ||
            colNumber === 10 ||
            colNumber === 12 ||
            colNumber === 14 ||
            colNumber === 16 ||
            colNumber === 18 ||
            colNumber === 20
          ) {
            cell.fill = colorStyle;
          }
        });
      }

      // Add the row for the current day with borders
      const dataRow = worksheet2.addRow(rowData);
      dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = borderStyle;
        // Apply color to columns B, D, and F (column numbers 2, 4, 6)
        if (
          colNumber === 2 ||
          colNumber === 4 ||
          colNumber === 6 ||
          colNumber === 8 ||
          colNumber === 10 ||
          colNumber === 12 ||
          colNumber === 14 ||
          colNumber === 16 ||
          colNumber === 18 ||
          colNumber === 20
        ) {
          cell.fill = colorStyle;
        }
      });
    });

    // Adjust column widths (optional)
    worksheet2.columns = [
      { width: 15 }, // Tanggal
      ...Array(24).fill({ width: 10 }), // Hours
      { width: 15 }, // Rata-rata
    ];

    // START SHEET 3
    const theData3 = await AllData.findAll({
      attributes: [
        [literal('DATE_FORMAT(tlocal, "%Y-%m")'), "month"],
        [literal('DATE_FORMAT(tlocal, "%d")'), "day"],
        [fn("AVG", col(requestnya)), `average_${requestnya}`],
      ],
      where: {
        kd_hardware: req.params.id,
        tlocal: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      group: [
        literal('DATE_FORMAT(tlocal, "%Y-%m")'),
        literal('DATE_FORMAT(tlocal, "%d")'),
      ],
      order: [
        [literal('DATE_FORMAT(tlocal, "%Y-%m")'), "ASC"],
        [literal('DATE_FORMAT(tlocal, "%d")'), "ASC"],
      ],
    });

    const dataByMonth = {};
    theData3.forEach((item) => {
      const month = item.getDataValue("month");
      const day = item.getDataValue("day");
      const average = item.getDataValue(`average_${requestnya}`);

      if (!dataByMonth[month]) {
        dataByMonth[month] = Array(32).fill(null);
      }
      dataByMonth[month][day - 1] = average;
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    Object.keys(dataByMonth).forEach((month) => {
      const values = dataByMonth[month].slice(0, 31);
      const sum = values.reduce(
        (acc, val) => (val !== null ? acc + val : acc),
        0
      );
      const count = values.reduce(
        (acc, val) => (val !== null ? acc + 1 : acc),
        0
      );
      dataByMonth[month][31] = sum / count;
    });

    // Map month numeric values (YYYY-MM) to month names
    const dataArray = Object.entries(dataByMonth).map(([month, values]) => {
      const [year, monthNumber] = month.split("-"); // Extract year and month number
      const monthName = monthNames[parseInt(monthNumber) - 1]; // Get month name from the array
      return [`${monthName} ${year}`, ...values]; // Format the string to "Month Year"
    });

    // const combinedData = [...defaultHeader, ...dataArray];

    defaultHeader.forEach((row) => {
      worksheet3.addRow(row);
    });

    const miniTitleRow = [
      "Bulan", // Month name placeholder
      ...Array.from({ length: 31 }, (_, i) => i + 1), // Days 1 to 31
      "Average per bulan", // Average column
    ];

    worksheet3.addRow(miniTitleRow);

    dataArray.forEach((row) => {
      worksheet3.addRow(row);
    });

    // Define a border style
    const borderStyle3 = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    // Define the fill color for columns B and D
    const fillStyle = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" }, // Yellow fill color
    };

    worksheet3.eachRow((row, rowNumber) => {
      if (rowNumber > defaultHeader.length) {
        // Skip the default header rows
        const hasData = row.values
          .slice(1, 34)
          .some((val) => val !== null && val !== ""); // Check if any cell in columns 1 to 33 has data

        if (hasData) {
          // Skip fully empty rows
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber <= 33) {
              // Apply styles only up to column 33
              if (
                colNumber === 2 ||
                colNumber === 4 ||
                colNumber === 6 ||
                colNumber === 8 ||
                colNumber === 10 ||
                colNumber === 12 ||
                colNumber === 14 ||
                colNumber === 16 ||
                colNumber === 18 ||
                colNumber === 20 ||
                colNumber === 22 ||
                colNumber === 24 ||
                colNumber === 26 ||
                colNumber === 28 ||
                colNumber === 30 ||
                colNumber === 32
              ) {
                // Only color columns B (2) and D (4)
                cell.fill = fillStyle;
              }
              cell.border = borderStyle3; // Apply border to cells with data
            }
          });
        }
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `${requestnya}_data_harian.xlsx`;

    // Expose the X-Filename header to the frontend
    res.setHeader("Access-Control-Expose-Headers", "X-Filename");

    // Set the custom header with the filename
    res.setHeader("X-Filename", filename);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the file buffer
    res.send(buffer);
  } catch (err) {
    console.error("Error creating Excel file:", err);
    res.status(500).send("Error generating Excel file");
  }
};
