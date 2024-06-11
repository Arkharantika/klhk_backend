import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------------------------------------------------
//                  === USER MANAGAMENET ===
// ----------------------------------------------------------

// >>> GET ALL USER
export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ["id", "name", "email", "role"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
