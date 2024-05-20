const { Factory } = require('fishery');
const { faker } = require('@faker-js/faker');
const User = require('../../src/models').User;

class UserFactory extends Factory {
  admin() {
    return this.params({ role: 'admin' });
  }

  user() {
    return this.params({ role: 'user' });
  }

  withEmail(email) {
    return this.params({ email });
  }
}

const userFactory = UserFactory.define(({ sequence, onCreate }) => {
  onCreate((user) => User.create(user, { logging: false }))

  return {
    userId: sequence,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.helpers.arrayElement(['admin', 'user']),
  };
});

module.exports = userFactory;
