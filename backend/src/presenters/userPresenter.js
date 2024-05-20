// src/presenters/userPresenter.js

const presentUser = (user) => {
  return {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
  };
};

module.exports = {
  presentUser
};
