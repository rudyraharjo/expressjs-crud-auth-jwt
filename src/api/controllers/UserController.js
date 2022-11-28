import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Joi from 'joi';

export const createUser = async (req, res) => {

    const { name, email, password, conf_password, role_id } = req.body;

    try {

        const schemaValidate = Joi.object().keys({
            name: Joi.string().required().messages({
                "string.empty": `"name" tidak boleh kosong`
            }),
            email: Joi.string().email().required().messages({
                "string.empty": `"email" tidak boleh kosong`
            }),
            password: Joi.string().min(6).required().messages({
                "string.empty": `"password" tidak boleh kosong`
            }),
            conf_password: Joi.string().valid(Joi.ref('password')).required(),
            role_id: Joi.number().required().messages({
                "number.empty": `"role_id" tidak boleh kosong`
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
                message: "Gagal menambahkan Pengguna Baru",
                errors: errorData
            });
        }

        const salt = await bcrypt.genSalt();
        const hastPassword = await bcrypt.hash(password, salt);

        const checkEmail = await Users.findOne({ where: { email: email } });

        if (checkEmail) {
            res.status(422).json({
                status: false,
                message: "Gagal menambahkan Pengguna Baru",
                errors: {
                    email: "Email sudah terdaftar"
                }
            });
        }

        const addUser = await Users.create({
            name: name,
            email: email,
            password: hastPassword,
            role_id: parseInt(role_id)
        });

        if (addUser) {
            let user = {
                id: addUser.id,
                name: addUser.name,
                email: addUser.email,
                role_id: addUser.role_id,
                createdAt: addUser.createdAt
            }
            res.status(201).json({
                status: true,
                message: "Berhasil menambahkan Pengguna Baru",
                body: user
            });
        } else {
            throw new Error('Gagal menambahkan Pengguna Baru');
        }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const readUser = async (req, res) => {

    try {
        // const users = await Users.findAll({
        //     attributes: ["id", "name", "email", "createdAt", "updatedAt"]
        // });

        let where = "";
        if (req.role_id == 2 || req.role_id == 3) {
            where = 'where u.role_id =' + req.role_id;
        }

        const users = await Users.sequelize.query(`select u.id, u.name, u.email, u.role_id, r.name as role_name  from users u 
        left join roles r on r.id = u.role_id ` + where);

        res.status(200).json({
            status: true,
            message: "Berhasil menampilkan daftar pengguna",
            body: users[0],
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const updateUser = async (req, res) => {

    const { id, name } = req.body;

    try {

        const schemaValidate = Joi.object().keys({
            id: Joi.number().required().messages({
                "number.empty": `"id" tidak boleh kosong`
            }),
            name: Joi.string().required().messages({
                "string.empty": `"name" tidak boleh kosong`
            })
        });

        const { error } = schemaValidate.validate(req.body);

        if (error) {

            let errorData = {};

            error.details.forEach(el => {
                errorData[el.path] = el.message
            });

            res.status(422).json({
                status: false,
                message: "Gagal melakukan Perubahan Pengguna",
                errors: errorData
            });
        }

        const checkUser = await Users.findByPk(id);

        if (checkUser === null) {
            res.status(422).json({
                status: false,
                message: "User Tidak ditemukan",
                body: null
            });
        }

        const updateUser = await Users.update({ name: name }, {
            where: {
                id: checkUser.id
            }
        });

        if (updateUser) {
            res.status(200).json({
                status: true,
                message: "Berhasil melakukan Perubahan Pengguna",
                body: updateUser
            });
        } else {
            throw new Error('Gagal melakukan Perubahan Pengguna');
        }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const readUserById = async (req, res) => {

    const { id } = req.params;

    try {

        const users = await Users.findByPk(parseInt(id), {
            attributes: ["id", "name", "email", "createdAt", "updatedAt"]
        });

        if (users === null) throw new Error('Data Pengguna tidak ditemukan');

        res.status(200).json({
            status: true,
            message: "Berhasil menampilkan Pengguna",
            body: users
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const deleteUserById = async (req, res) => {

    const { id } = req.body;

    try {

        const users = await Users.findByPk(parseInt(id));

        if (users === null) throw new Error('Data Pengguna tidak ditemukan');

        await Users.destroy({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({
            status: true,
            message: "Berhasil menghapus Pengguna"
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}
