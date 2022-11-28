import express from "express";
import dbConnect from './src/config/Database.js';
import router from './src/api/routes/index.js';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import Roles from "./src/api/models/RoleModel.js";
import Users from "./src/api/models/UserModel.js";
import Schedule from "./src/api/models/ScheduleModel.js";


dotenv.config();

const app = express();

try {
    await dbConnect.authenticate();
    console.log("Database Connect");
    // Users.sync({ force: true })
    // Roles.sync({ force: true })
    // Schedule.sync({ force: true })
} catch (err) {
    console.log(err, "Error Database Connect");
}

app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});

app.get("/random-secret", (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    res.json({ body: token });
});



app.listen(process.env.PORT, () => console.log(`Server Running at Port ${process.env.PORT}`));