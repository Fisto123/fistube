import userModel from "../model/user.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import generateUnqueId from "generate-unique-id";

export const createUser = async (req, res, next) => {
  //   try {
  //     const hashedPassword = await bcrypt.hash(req.body.password, 12);
  // const userInfo = new userModel({
  //     ...req.body,
  //     password:hashedPassword
  // })
  //      const users = await userInfo.save()
  //       res.status(200).json(users)
  //   } catch (err) {
  //      //catch error
  //      next(err)
  //   }
  try {
    const {
      name,
      email,
      password,
      cPassword,
      image,
      subscribedUser,
      subscribed,
    } = req.body;
    let user = await userModel.findOne({ email });
    let doesExist = await userModel.findOne({ name });

    if (user)
      return next(createError(400, "user with given email already exists"));

    if (password !== cPassword)
      return next(createError(403, "password does not match"));

    if (doesExist) {
      console.log(doesExist);
      const id = generateUnqueId({
        length: 3,
        useLetters: false,
      });
      return next(
        createError(
          403,
          `You can use any of the following username
                ${doesExist.name + id},
                 ${
                   doesExist.name +
                   (Number(id) + Math.floor(Math.random() * 100))
                 },
                  ${
                    doesExist.name +
                    (Number(id) + Math.floor(Math.random() * 30))
                  },
                  ${
                    doesExist.name +
                    (Number(id) + Math.floor(Math.random() * 35))
                  }
           `
        )
      );
    }

    if (!name || !email || !password)
      return next(createError(403, "Please enter all fields...."));

    if (!validator.isEmail(email))
      return next(createError(400, "email must be a valid email"));

    if (!validator.isStrongPassword(password))
      return next(
        createError(
          400,
          "please use one number, one character and a special case"
        )
      );

    user = new userModel({
      name,
      email,
      password,
      image,
      subscribedUser,
      subscribed,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const currentUser = await userModel.findOne({ email: req.body.email });
    console.log(currentUser);
    if (!currentUser) return next(createError(404, "User not found"));
    const isCorrect = await bcrypt.compare(
      req.body.password,
      currentUser.password
    );
    if (!isCorrect) return next(createError(400, "wrong password"));

    const token = jwt.sign(
      {
        id: currentUser._id,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );

    const { password, ...others } = currentUser._doc;

    res.status(200).json({ ...others, token });
  } catch (err) {
    //catch error
    next(err);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT, {
        expiresIn: "3d",
      });

      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, token });
    } else {
      const newUser = new userModel({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
