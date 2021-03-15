require('dotenv').config();
const express = require('express');
const wrap = require('../../common/errors/async-error-wrapper');
const checkMiddleware = require('../../common/validation/auth.validation');
const userService = require('./user.service');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs/promises');

const router = express.Router();

// const loader = multer({dest: path.join(__dirname, 'tmp')});

// app.router('/', loader.single('avatar'), async function (req, res) {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path);
//     res.send(result);
//   } catch (error) {
//     res.send(error);
//   }
//   fs.unlink(req.file.path);
// });

router.post('/register',checkMiddleware.checkRegister, wrap(async (req, res) => {
  const data = await userService.register(req.body);
  return res.json(data);
}));

router.post('/login', checkMiddleware.checkLogin,  wrap(async (req, res) => {
  const data = await userService.login(req);
  return res.json(data);
}));

module.exports = router;
