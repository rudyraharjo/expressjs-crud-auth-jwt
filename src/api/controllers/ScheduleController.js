import Joi from 'joi';
import Schedule from '../models/ScheduleModel.js';
import Users from '../models/UserModel.js';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const createSchedule = async (req, res) => {

    const { doctor_id, day, time_start, time_finish, quota, range_start, range_end } = req.body;

    try {

        const schemaValidate = Joi.object().keys({
            doctor_id: Joi.number().required().messages({
                "string.empty": `"doctor_id" tidak boleh kosong`
            }),
            day: Joi.string().required().messages({
                "string.empty": `"day" tidak boleh kosong`
            }),
            time_start: Joi.string().required().messages({
                "string.empty": `"time_start" tidak boleh kosong`
            }),
            time_finish: Joi.string().required().messages({
                "string.empty": `"time_finish" tidak boleh kosong`
            }),
            quota: Joi.number().required().messages({
                "string.empty": `"quota" tidak boleh kosong`
            }),
            range_start: Joi.string().required().messages({
                "string.empty": `"range_start" tidak boleh kosong`
            }),
            range_end: Joi.string().required().messages({
                "string.empty": `"range_end" tidak boleh kosong`
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
                message: "Gagal menambahkan Jadwal",
                errors: errorData
            });
        }

        const checkUser = await Users.findByPk(parseInt(doctor_id));

        if (checkUser === null) throw new Error('Data Pengguna tidak ditemukan');

        if (checkUser.role_id == 1 || checkUser.role_id == 2) throw new Error('Data Pengguna tidak memiliki akses');

        let start = new Date(range_start);
        let end = new Date(range_end);
        let tempData = [];

        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {

            const q = new Date(d);
            let dayL = q.getDate().toString().padStart(2, "0"); //  q.getDay()
            let dayName = days[d.getDay()];
            let month = (q.getMonth() + 1).toString().padStart(2, "0"); // q.getMonth()
            let year = q.getFullYear();
            const dateS = year + '-' + month + '-' + dayL;

            if (day.toLowerCase() == dayName.toLowerCase()) {
                tempData.push({
                    'doctor_id': parseInt(doctor_id),
                    'time_start': time_start,
                    'time_finish': time_finish,
                    'quota': quota,
                    'date': dateS,
                    'day': dayName,
                    'status': true,
                    'date': dateS
                });
            }
        }

        // tempData.forEach(el => {
        // console.log(el.date, el.day)
        // const insert = await Schedule.create({
        //     name: name,
        //     email: email,
        //     password: hastPassword,
        //     role_id: parseInt(role_id)
        // });
        // });

        const schedules = await Schedule.bulkCreate(tempData);

        if (schedules) {
            res.status(201).json({
                status: true,
                message: "Berhasil menambahkan Jadwal",
                body: schedules
            });
        } else {
            res.status(422).json({
                status: false,
                message: "Gagal menambahkan Jadwal",
                body: null
            });
        }


    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}

export const readSchedule = async (req, res) => {
    try {
        const schedules = await Schedule.sequelize.query(`select s.id, s.day, s.time_start, s.time_finish, s.quota, s.status, s.date, u.name, u.role_id from schedule s left join users u on u.id = s.doctor_id  where u.role_id  = 3`);

        res.status(200).json({
            status: true,
            message: "Berhasil menampilkan daftar jadwal",
            body: schedules
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message,
            body: null
        });
    }
}