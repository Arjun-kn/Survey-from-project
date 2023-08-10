const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRouter = express.Router();
const { register } = require("../models/usermodel");
userRouter.post("/register", async (req, res) => {
  const { name, email, phone, profession, password } = req.body;
  if (!name || !email || !phone || !profession || !password) {
    return res.send(`All fields are required`);
  }
  register
    .findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.send(`User already exists`);
      } else {
        bcrypt.hash(password, 10).then((hashPassword) => {
          const user = new register({
            name,
            email,
            phone,
            profession,
            password: hashPassword,
          });
          user
            .save()
            .then((newUser) => {
              res.json({ message: "User registered successfully" });
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      }
    })
    .catch((err) => console.log(err.message));
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json(`All fields are required`);
  }
  register
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.json(`User not fount`);
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.json(`Invalid email/password`);
          }
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.Skey
          );
          res.json(token);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
module.exports = userRouter;
