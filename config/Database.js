import { Sequelize } from "sequelize";

// const DB = new Sequelize("alkarima", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
//   timezone: "+07:00",
// });

const DB = new Sequelize("nitip_klhk", "admrnd", "T0batreal!", {
  dialect: "mysql", // or any other dialect
  host: "localhost",
  timezone: '+07:00'
});

export default DB;
