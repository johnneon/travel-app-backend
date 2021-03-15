const { check } = require('express-validator');

const checkRegister = [
  check('email', 'Incorect email!').isEmail(),
  check('fullName', 'Type of name must be string!').isString(),
  check('password', 'Minimum number of characters 6!').isLength({ min: 6 }),
];

const checkLogin = [  
  check('email', 'Incorect email!').isEmail().normalizeEmail(),
  check('password', 'Incorect password!').exists(),
];

module.exports = {
  checkRegister,
  checkLogin
}