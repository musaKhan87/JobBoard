const express = require("express");
const { adminLogin, adminLogout } = require("../controller/auth-controller");
const authRouter = express.Router();

// POST /api/auth/login - Admin login
authRouter.post("/login", adminLogin);

// POST /api/auth/logout - Admin logout
authRouter.post("/logout", adminLogout);

module.exports = authRouter;