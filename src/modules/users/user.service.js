const userRepo = require('./user.repository');

const register = async (req) => {
  const user = await userRepo.createUser(req);
  return user;
};

const login = async (req) => {
  const user = await userRepo.loginUser(req);
  return user;
};

module.exports = {
  register,
  login,
};
