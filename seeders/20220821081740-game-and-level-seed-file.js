'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const basicLevel = ['level1', 'level2', 'level3', 'level4']
    await queryInterface.bulkInsert('Levels',
      basicLevel.map(l => ({
        level_name: l,
        created_at: new Date(),
        updated_at: new Date()
      })), {})
    await queryInterface.bulkInsert('Games', [{
      game_name: 'Match 10 Card Game',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Games', {})
    await queryInterface.bulkDelete('Levels', {})
  }
};
