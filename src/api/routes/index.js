import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { Login, Logout, RefreshToken } from "../controllers/AuthController.js";
import { createRole, deleteRoleById, readRole, readRoleById, updateRole } from "../controllers/RoleController.js";
import { createUser, readUser, updateUser, readUserById, deleteUserById } from '../controllers/UserController.js';
import { createSchedule, readSchedule } from "../controllers/ScheduleController.js";

const router = express.Router();

router.post('/auth/login', Login);
router.get('/auth/refresh-token', RefreshToken);
router.post('/auth/logout', Logout);

router.post('/user/create', verifyToken, createUser);
router.get('/user/read', verifyToken, readUser);
router.get('/user/read/:id', verifyToken, readUserById);
router.post('/user/update', verifyToken, updateUser);
router.post('/user/delete', verifyToken, deleteUserById);

router.post('/role/create', verifyToken, createRole);
router.get('/role/read', verifyToken, readRole);
router.get('/role/read/:id', verifyToken, readRoleById);
router.post('/role/update', verifyToken, updateRole);
router.post('/role/delete', verifyToken, deleteRoleById);

router.post('/schedule/create', verifyToken, createSchedule);
router.post('/schedule/read', verifyToken, readSchedule);

export default router;