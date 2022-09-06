'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const classes = [{
      name: '日間照護',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      name: '社區復健',
      created_at: new Date(),
      updated_at: new Date()
    }]

    await queryInterface.bulkInsert('Classes', classes, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Classes', null, {})
  }
};
