import Joi from 'joi';
import Roles from "../models/RoleModel.js";

export const createRole = async (req, res) => {

    const { name } = req.body;

    try {

        const schemaValidate = Joi.object().keys({
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
                message: "Gagal menambahkan Peran Baru",
                errors: errorData
            });
        }

        const checkRole = await Roles.findOne({ where: { name: name } });

        if (checkRole) {
            res.status(422).json({
                status: false,
                message: "Gagal menambahkan Peran Baru",
                errors: {
                    email: "Nama Peran sudah terdaftar"
                }
            });
        }

        const addRole = await Roles.create({
            name: name
        });

        if (addRole) {
            res.status(201).json({
                status: true,
                message: "Berhasil menambahkan Peran Baru",
                body: addRole
            });
        } else {
            throw new Error('Gagal menambahkan Peran Baru');
        }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const readRole = async (req, res) => {

    try {
        const Roles = await Roles.findAll({
            attributes: ["id", "name","createdAt", "updatedAt"]
        });

        res.status(200).json({
            status: true,
            message: "Berhasil menampilkan daftar Peran",
            body: Roles,
            // asdf: cars
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const updateRole = async (req, res) => {

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
                message: "Gagal melakukan Perubahan Peran",
                errors: errorData
            });
        }

        const checkRole = await Roles.findByPk(id);

        if (checkRole === null) {
            res.status(422).json({
                status: false,
                message: "Peran Tidak ditemukan",
                body: null
            });
        }

        const updateRole = await Roles.update({ name: name }, {
            where: {
                id: checkRole.id
            }
        });

        if (updateRole) {
            res.status(200).json({
                status: true,
                message: "Berhasil melakukan Perubahan Peran",
                body: updateRole
            });
        } else {
            throw new Error('Gagal melakukan Perubahan Peran');
        }

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const readRoleById = async (req, res) => {

    const { id } = req.params;

    try {

        const Roles = await Roles.findByPk(parseInt(id), {
            attributes: ["id", "name", "createdAt", "updatedAt"]
        });

        if (Roles === null) throw new Error('Data Peran tidak ditemukan');

        res.status(200).json({
            status: true,
            message: "Berhasil menampilkan Peran",
            body: Roles
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const deleteRoleById = async (req, res) => {

    const { id } = req.body;

    try {

        const Roles = await Roles.findByPk(parseInt(id));

        if (Roles === null) throw new Error('Data Peran tidak ditemukan');

        await Roles.destroy({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({
            status: true,
            message: "Berhasil menghapus Peran"
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}
