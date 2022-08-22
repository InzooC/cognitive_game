'use strict';
// const { NOW } = require('sequelize');
// const Level = require('../models/gameLevel')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const levels = await queryInterface.sequelize.query('SELECT id FROM Levels', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const gameId = await queryInterface.sequelize.query('SELECT id FROM Games', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('GameLevels',
      levels.map(l => ({
        game_id: gameId[0].id,
        level_id: l.id,
        created_at: new Date(),
        updated_at: new Date()
      }))
      , {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('GameLevels', null, {});

  }
};
