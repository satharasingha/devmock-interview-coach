import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function createUser(req, res) {
  try {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      password: passwordHash,
    });

    await newUser.save();

    res.json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.json({
      message: "Error creating user",
    });
  }
}



export async function loginUser(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    console.log(user);

    if (user == null) {
      res.json({
        message: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (isPasswordCorrect) {
        res.json({
          message: "Login Successful",
        });
      } else {
        res.json({
          message: "Invalid Password",
        });
      }
    }
  } catch (error) {
    res.json({
      message: "Error logging in",
    });
  }
}
