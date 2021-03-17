require('dotenv').config();
const User = require('./user.schema');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const {
  UserHasRegistred,
  BadRequestError,
  UserNotFound,
  IncorectPassword,
} = require('../../common/errors/errors-list');
const jwt = require('jsonwebtoken');

const createUser = async (req) => {
  const errors = validationResult(req);

  if (!(errors.isEmpty())) {
    throw new BadRequestError('Incorect data');
  }
  
  const { email, fullName, password, avatar } = req.body;
  
  const hashedPassword = await bcrypt.hash(password, 12);

  const condidate = await User.findOne({ email });

  if (condidate) {
    throw new UserHasRegistred(condidate.email);
  }

  await User.create({ email, password: hashedPassword, fullName, avatar });

  const createdUser = await User.aggregate()
  .match({ email })
  .replaceRoot({
    $mergeObjects: [{ id: '$_id' }, '$localizations', '$$ROOT'],
  })
  .project({ _id: 0, __v: 0 })
  .then((data) => data[0]);

  const secret = process.env.JWT_SECRET || 'protectedone';
  const token = jwt.sign({ userId: createdUser.id }, secret, { expiresIn: '7d' });
  createdUser.token = token;
  createdUser.password = undefined;
  
  return createdUser;
};

const loginUser = async (req) => {
  const errors = validationResult(req);
  
  if (!(errors.isEmpty())) {
    throw new BadRequestError('Incorect data');
  }

  const { email, password } = req.body;

  const user = await User.aggregate()
    .match({ email })
    .replaceRoot({
      $mergeObjects: [{ id: '$_id' }, '$localizations', '$$ROOT'],
    })
    .project({ _id: 0, __v: 0 })
    .then((data) => data[0]);

  if (!user) {
    throw new UserNotFound(email);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new IncorectPassword();
  }

  const secret = process.env.JWT_SECRET || 'protectedone';
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
  user.token = token;
  user.password = undefined;

  return user;
}

module.exports = {
  createUser,
  loginUser
}