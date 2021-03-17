require('dotenv').config();
const express = require('express');
const wrap = require('../../common/errors/async-error-wrapper');
const checkMiddleware = require('../../common/validation/auth.validation');
const userService = require('./user.service');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');

const router = express.Router();

const loader = multer({dest: path.join(__dirname, 'tmp')});

router.post('/register', loader.single('avatar'), wrap(async (req, res) => {
  console.log(req.body, req.file);
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {upload_preset: 'avatarPreset'});

    req.body.avatar = result.secure_url;
    console.log(req.body);
    const data = await userService.register(req);
    return res.json(data);
  } catch (error) {
    res.send(error);
  }
  fs.unlink(req.file.path);
}));

router.post('/login', loader.any(),  wrap(async (req, res) => {
  const data = await userService.login(req);
  return res.json(data);
}));

module.exports = router;
