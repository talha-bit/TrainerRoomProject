const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load Customer model
const Customer = require("../../models/Customer");
const Trainer = require("../../models/Trainer");
const Admin = require("../../models/Admin");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userType = req.body.userType;

  switch (userType) {
    case "Customer":
      Customer.findOne({ email: req.body.email }).then((customer) => {
        if (customer) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newCustomer = new Customer({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newCustomer.password, salt, (err, hash) => {
              if (err) throw err;
              newCustomer.password = hash;
              newCustomer
                .save()
                .then((customer) => res.json(customer))
                .catch((err) => console.log(err));
            });
          });
        }
      });
      break;
    case "Trainer":
      Trainer.findOne({ email: req.body.email }).then((trainer) => {
        if (trainer) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newTrainer = new Trainer({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newTrainer.password, salt, (err, hash) => {
              if (err) throw err;
              newTrainer.password = hash;
              newTrainer
                .save()
                .then((trainer) => res.json(trainer))
                .catch((err) => console.log(err));
            });
          });
        }
      });
      break;
    case "Admin":
      Admin.findOne({ email: req.body.email }).then((admin) => {
        if (admin) {
          return res.status(400).json({ email: "Email already exists" });
        } else {
          const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });

          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newAdmin.password, salt, (err, hash) => {
              if (err) throw err;
              newAdmin.password = hash;
              newAdmin
                .save()
                .then((admin) => res.json(admin))
                .catch((err) => console.log(err));
            });
          });
        }
      });
      break;

    default:
      console.log("Error: Invalid User Type");
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  const userType = req.body.userType;

  switch (userType) {
    case "Customer":
      // Find user by email
      Customer.findOne({ email }).then((customer) => {
        // Check if customer exists
        if (!customer) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, customer.password).then((isMatch) => {
          if (isMatch) {
            // customer matched
            // Create JWT Payload
            const payload = {
              id: customer.id,
              name: customer.name,
              userType: "Customer"
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926, // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ passwordincorrect: "Password incorrect" });
          }
        });
      });
      break;
    case "Trainer":
      // Find trainer by email
      Trainer.findOne({ email }).then((trainer) => {
        // Check if trainer exists
        if (!trainer) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, trainer.password).then((isMatch) => {
          if (isMatch) {
            // trainer matched
            // Create JWT Payload
            const payload = {
              id: trainer.id,
              name: trainer.name,
              userType: "Trainer"
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926, // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ passwordincorrect: "Password incorrect" });
          }
        });
      });
      break;
    case "Admin":
      // Find admin by email
      Admin.findOne({ email }).then((admin) => {
        // Check if admin exists
        if (!admin) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }

        // Check password
        bcrypt.compare(password, admin.password).then((isMatch) => {
          if (isMatch) {
            // admin matched
            // Create JWT Payload
            const payload = {
              id: admin.id,
              name: admin.name,
              userType: "Admin"
            };

            // Sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              {
                expiresIn: 31556926, // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ passwordincorrect: "Password incorrect" });
          }
        });
      });
      break;
    default:
      console.log("ERROR: Invalid User Type");
  }
});

module.exports = router;
