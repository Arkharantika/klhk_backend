import { Sequelize } from "sequelize";

// const DB = new Sequelize("alkarima", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   timezone: "+07:00",
// });

const DB = new Sequelize("nitip_klhk", "virgo", "Admin321!", {
  dialect: "mysql", // or any other dialect
  host: "43.252.105.150",
  timezone: '+07:00'
});

export default DB;
