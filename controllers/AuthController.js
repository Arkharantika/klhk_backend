import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ----------------------------------------------------------
//                  === AUTH MANAGAMENET ===
// ----------------------------------------------------------

// >>> REGISTER NEW USER
export const RegisterUser = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json("password are not match!");
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      password: hashedPassword,
      email: email,
      role: "user",
    });
    return res.status(200).json("register success !");
  } catch (error) {
    console.log(error);
  }
};

// >>> LOGIN USER
export const LoginUser = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (user.length > 0) {
      const match = await bcrypt.compare(req.body.password, user[0].password);
      if (!match) return res.status(400).json("email or password is wrong!");
      const userId = user[0].id;
      const name = user[0].name;
      const email = user[0].email;
      const role = user[0].role;
      const accessToken = jwt.sign(
        { userId, name, email, role },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "60s",
        }
      );
      const refreshToken = jwt.sign(
        { userId, name, email, role },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      await Users.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: userId,
          },
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        //   secure:true
      });
      res.json({ accessToken });
    }
    // return res.send("ada usersnya");
    else return res.status(404).json("email or password is wrong!");
  } catch (error) {
    return res.status(400).json(error);
  }
};

// >>> LOGOUT USER
export const LogoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(403);
  const userId = user[0].id;
  await Users.update(
    {
      refresh_token: null,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken");
  return res.status(200).json("success logout!");
};
