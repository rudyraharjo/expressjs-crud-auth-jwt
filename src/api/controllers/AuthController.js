import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from 'joi';

export const Login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const schemaValidate = Joi.object().keys({
            email: Joi.string().email().required().messages({
                "string.empty": `"email" tidak boleh kosong`
            }),
            password: Joi.string().min(6).required().messages({
                "string.empty": `"password" tidak boleh kosong`
            }),
        });

        const { error } = schemaValidate.validate(req.body);

        if (error) {

            let errorData = {};

            error.details.forEach(el => {
                errorData[el.path] = el.message
            });

            res.status(422).json({
                status: false,
                message: "Gagal melakukan Login",
                errors: errorData
            });
        }

        const user = await Users.findAll({
            where: {
                email: email
            }
        })

        const matchPassword = await bcrypt.compare(password, user[0].password);

        if (!matchPassword) {
            throw new Error('Password Tidak Valid');
        }

        const userId = user[0].id;
        const userName = user[0].name;
        const userEmail = user[0].email;
        const userRoleId = user[0].role_id;

        const accessToken = jwt.sign({ userId, userName, userEmail, userRoleId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h'
        })

        const refreshToken = jwt.sign({ userId, userName, userEmail, userRoleId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1h'
        })

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day => miliseconds
            // secure: true // if HTTPS
        })

        let result = {
            "meta": {
                "access_token": accessToken,
                "expiresIn": "1h"
            }
        }

        res.status(200).json({
            status: true,
            message: "Berhasil Login",
            body: result
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}


export const RefreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) throw new Error('Refresh Token Tidak Valid, Silahkan Login kembali');

        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user[0]) throw new Error('Refresh Token Tidak Valid, Silahkan Login kembali');

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if (err) {
                res.status(401).json({
                    status: false,
                    message: "Failed Refresh Token (" + err.message + ")",
                });
            }

            const userId = user[0].id;
            const userName = user[0].name;
            const userEmail = user[0].email;
            const userRoleId = user[0].role_id;

            const accessToken = jwt.sign({ userId, userName, userEmail, userRoleId }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h'
            })

            let result = {
                "meta": {
                    "access_token": accessToken,
                    "expiresIn": "1h"
                }
            }

            res.status(200).json({
                status: true,
                message: "Berhasil Refresh token",
                body: result
            });

        });


    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const Logout = async (req, res) => {

    try {

        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) throw new Error('Refresh Token Tidak Valid, Silahkan Login kembali');

        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user[0]) throw new Error('Refresh Token Tidak Valid, Silahkan Login kembali');

        const userId = user[0].id;

        await Users.update({ refresh_token: null }, {
            where: {
                id: userId
            }
        });

        res.clearCookie("refresh_token");

        res.status(200).json({
            status: true,
            message: "Berhasil Logout"
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }

}