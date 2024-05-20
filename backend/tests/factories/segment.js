const { Factory } = require('fishery');
const { faker } = require('@faker-js/faker');
const { on } = require('supertest/lib/test');
const Segment = require('../../src/models').Segment;

const segmentFactory = Factory.define(({ sequence, onCreate}) => {{
  onCreate((segment) => Segment.create(segment, { logging: false }));

  return {
    id: sequence,
    name: faker.word.words(),
    description: faker.lorem.sentence(),
    criteria: [
      {
        attribute: faker.word.words(),
        operator: faker.helpers.arrayElement(['equals', 'greater_than', 'less_than', 'contains']),
        value: faker.helpers.arrayElement([faker.word.words(), faker.number.int(), faker.datatype.boolean()]),
      },
    ],
  }
}});

module.exports = segmentFactory;
