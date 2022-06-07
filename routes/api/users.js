const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load Customer model
const Customer = require("../../models/Customer");
const Trainer = require("../../models/Trainer");
const Admin = require("../../models/Admin");

router.get("/getClasses", (req, res) => {
    const classes = [
        {id: 1, name: "Leg Training", description: "Come and join me for an amazing leg day!"},
        {id: 2, name: "Chest Training", description: "Chests!"},
        {id: 3, name: "Biceps Training", description: "Squeeze 'em out!"},
    ]
    res.json({classes: classes})
})

function findId(classes, id) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < classes.length; i++) {
            if (id.equals(classes[i]._id)) {
                resolve(true);
                break;
            }
        }
        reject();
    });
}

router.post("/joinClass", (req, res) => {

    const {user, classToJoin} = req.body

    Customer.findById(user.id)
        .then(customer => {
            if (customer) {
                // findId(customer.classes, classToJoin.id)
                //     .then((isJoined) => {
                //         if (isJoined) {
                //             res.json({code: "Class already joined."})
                //         }
                //     })
                //     .catch(() => {
                Customer.updateOne({_id: user.id},
                    {$push: {classes: classToJoin.id}})
                    .then(() => {
                        res.json({code: "Class joined successfully."})
                        // })
                    })
            }
        })
})

// Request to return all the customers in the database
router.get("/getCustomers", (req, res) => {
    Customer.find().then((customers) => {
        if (customers) {
            res.json({customers: customers})
        } else {
            res.status(400).json();
        }
    });
});

// Request to return one customer in the database
router.post("/getCustomer", (req, res) => {
    Customer.findById(req.body.id).then((customer) => {
        if (customer) {
            res.json({customer: customer})
        } else {
            res.status(400).json();
        }
    });
});

// Request to return all the trainers in the database
router.get("/getTrainers", (req, res) => {
    Trainer.find().then((trainers) => {
        if (trainers) {
            res.json({trainers: trainers})
        } else {
            res.status(400).json();
        }
    });
});

router.post("/deleteCustomer", (req, res) => {
    const {toBeRemoved} = req.body
    Customer.deleteOne({_id: toBeRemoved})
        .then(() => {
            Customer.find().then((customers) => {
                if (customers) {
                    res.status(200).json({customers: customers})
                }
            })
                .catch(() => res.status(400).json())
        })
});

router.post("/deleteTrainer", (req, res) => {
    const {toBeRemoved} = req.body
    Trainer.deleteOne({_id: toBeRemoved})
        .then(() => {
            Trainer.find().then((trainers) => {
                if (trainers) {
                    res.status(200).json({trainers: trainers})
                }
            })
                .catch(() => res.status(400).json())
        })
});

router.post("/resetPassword", (req, res) => {

    const {id, oldPassword, newPassword} = req.body

    Customer.findById(id)
        .then((customer) => {
            bcrypt.compare(oldPassword, customer.password)
                .then(result => {
                    if (result) {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newPassword, salt, (err, hash) => {
                                if (err) throw err;
                                Customer.updateOne({_id: id}, {password: hash})
                                    .then((isSuccess) => {
                                        res.json(isSuccess)
                                    })
                                    .catch((err) => console.log(err));
                            });
                        });
                    } else {
                        console.log("Password does not match")
                        res.json({error: "Old password does not match"})
                    }
                })
        })
})

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation

    const {errors, isValid} = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Customer.findOne({email: req.body.email}).then((customer) => {
        if (customer) {
            return res.status(400).json({email: "Email already exists"});
        } else {
            const newCustomer = new Customer({
                name: req.body.name, email: req.body.email, password: req.body.password,
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
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation

    const {errors, isValid} = validateLoginInput(req.body);

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
            Customer.findOne({email}).then((customer) => {
                // Check if customer exists
                if (!customer) {
                    return res.status(404).json({emailnotfound: "Email not found"});
                }

                // Check password
                bcrypt.compare(password, customer.password).then((isMatch) => {
                    if (isMatch) {
                        // customer matched
                        // Create JWT Payload
                        const payload = {
                            id: customer.id, name: customer.name, userType: "Customer"
                        };

                        // Sign token
                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 31556926, // 1 year in seconds
                        }, (err, token) => {
                            res.json({
                                success: true, token: "Bearer " + token,
                            });
                        });
                    } else {
                        return res
                            .status(400)
                            .json({passwordincorrect: "Password incorrect"});
                    }
                });
            });
            break;
        case "Trainer":
            // Find trainer by email
            Trainer.findOne({email}).then((trainer) => {
                // Check if trainer exists
                if (!trainer) {
                    return res.status(404).json({emailnotfound: "Email not found"});
                }

                // Check password
                bcrypt.compare(password, trainer.password).then((isMatch) => {
                    if (isMatch) {
                        // trainer matched
                        // Create JWT Payload
                        const payload = {
                            id: trainer.id, name: trainer.name, userType: "Trainer"
                        };

                        // Sign token
                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 31556926, // 1 year in seconds
                        }, (err, token) => {
                            res.json({
                                success: true, token: "Bearer " + token,
                            });
                        });
                    } else {
                        return res
                            .status(400)
                            .json({passwordincorrect: "Password incorrect"});
                    }
                });
            });
            break;
        case "Admin":
            // Find admin by email
            Admin.findOne({email}).then((admin) => {
                // Check if admin exists
                if (!admin) {
                    return res.status(404).json({emailnotfound: "Email not found"});
                }

                // Check password
                bcrypt.compare(password, admin.password).then((isMatch) => {
                    if (isMatch) {
                        // admin matched
                        // Create JWT Payload
                        const payload = {
                            id: admin.id, name: admin.name, userType: "Admin"
                        };

                        // Sign token
                        jwt.sign(payload, keys.secretOrKey, {
                            expiresIn: 31556926, // 1 year in seconds
                        }, (err, token) => {
                            res.json({
                                success: true, token: "Bearer " + token,
                            });
                        });
                    } else {
                        return res
                            .status(400)
                            .json({passwordincorrect: "Password incorrect"});
                    }
                });
            });
            break;
        default:
            console.log("ERROR: Invalid User Type");
    }
});

module.exports = router;
