import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";
import isEmailUsed from "../utils/isEmailUsed";
const authController = {
    login: [
        body("email")
            .exists()
            .isEmail()
            .withMessage("Wrong email format.")
            .escape(),
        body("password").escape(),
        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    statusBool: true,
                    message: "login failed",
                    errors: [...errors.array()],
                });
            } else {
                const user = await User.findOne({
                    email: req.body.email,
                }).catch((err) => next(err));
                if (user) {
                    bcrypt.compare(
                        req.body.password,
                        user.password,
                        (err, result) => {
                            if (err) return next(err);
                            if (result) {
                                const secret = process.env.SECRET || "SECRET";
                                const token = jwt.sign(
                                    { email: user.email },
                                    secret,
                                    {
                                        expiresIn: "1 year",
                                    }
                                );
                                return res.status(200).json({
                                    statusBool: true,
                                    message: "Auth Passed",
                                    userId: user._id,
                                    token,
                                });
                            } else {
                                return res.status(400).json({
                                    statusBool: false,
                                    message: "Wrong password",
                                });
                            }
                        }
                    );
                } else {
                    return res.status(404).json({
                        statusBool: false,
                        message: "user not found",
                    });
                }
            }
        },
    ],
    facebookLogin: (req: Request, res: Response) => {
        // do something with req.user
    },
    signup: [
        body("firstName")
            .exists()
            .trim()
            .isAlpha()
            .withMessage("First name can only be alphabetic.")
            .isLength({ min: 1, max: 20 })
            .withMessage(
                "First name cannot be empty or more than 20 characters."
            )
            .escape(),
        body("lastName")
            .exists()
            .trim()
            .isAlpha()
            .withMessage("Last name can only be alphabetic.")
            .isLength({ min: 1, max: 20 })
            .withMessage(
                "Last name cannot be empty or more than 20 characters."
            )
            .escape(),
        body("password")
            .exists()
            .trim()
            .isLength({ min: 8, max: 32 })
            .withMessage(
                "password cannot be less than 8 or more then 32 characters."
            )
            .escape(),
        body("email")
            .exists()
            .isEmail()
            .withMessage("Wrong email format.")
            .escape(),
        async (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            const files = req.files as Express.Multer.File[];
            const profilePicture = files[0]
                ? files[0]
                : { buffer: "", mimetype: "" };
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    statusBool: false,
                    message: "signup failed",
                    errors: [...errors.array()],
                });
            } else {
                const emailUsed = await isEmailUsed(req.body.email);
                if (emailUsed) {
                    return res.status(400).json({
                        statusBool: false,
                        message: "signup failed",
                        errors: [
                            {
                                value: req.body.email,
                                msg: "email is already used",
                                param: "email",
                                location: "body",
                            },
                        ],
                    });
                } else {
                    bcrypt.hash(
                        req.body.password,
                        10,
                        async (err: any, hashedPassword: String) => {
                            if (err) next(err);
                            const user = await User.create({
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                password: hashedPassword,
                                email: req.body.email,
                                profilePicture: {
                                    data: profilePicture.buffer,
                                    contentType: profilePicture.mimetype,
                                },
                            }).catch((err: any) => {
                                next(err);
                            });
                            if (user)
                                return res.status(200).json({
                                    statusBool: true,
                                    message: "signup succeed",
                                    userId: user._id.toString(),
                                });
                        }
                    );
                }
            }
        },
    ],
};

export default authController;
