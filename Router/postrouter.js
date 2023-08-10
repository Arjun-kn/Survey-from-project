let express = require("express");
let Postdata = require("../models/postmodel");
require("dotenv").config();
let authenticateUser = require("../middleware/middle");
let jwt = require("jsonwebtoken");

let postapp = express.Router();

postapp.get("/userpost", authenticateUser, (req, res) => {
  jwt.verify(req.userId, process.env.Skey, (err, auth) => {
    if (err) {
      res.status(404).json({ message: "Invalid token" });
    } else {
      Postdata.find({ user: auth._id })
        .then((record) => {
          res.status(200).json({ message: "Successfull", data: record });
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to fetch post" });
        });
    }
  });
});

postapp.post("/userpost", authenticateUser, (req, res) => {
  jwt.verify(req.userId, process.env.Skey, (err, auth) => {
    if (err) {
      res.status(404).json({ message: "Authentication Failed" });
    } else {
      let newdata = new Postdata({
        Name: req.body.Name,
        Description: req.body.Description,
        Type: req.body.Type,
        Start_Date: req.body.Start_Date,
        End_Date: req.body.End_Date,
        Action: req.body.Action,
      });

      newdata
        .save()
        .then((record) => {
          res
            .status(200)
            .json({ message: "Data post successfully", data: record });
        })
        .catch((err) => {
          res.status(404).json({ message: "Failed to post data" });
        });
    }
  });
});

module.exports = postapp;
