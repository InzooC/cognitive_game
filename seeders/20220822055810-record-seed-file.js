'use strict';
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(`SELECT id FROM Users WHERE role = 'user'`, { type: queryInterface.sequelize.QueryTypes.SELECT })
    const gameLevelId = await queryInterface.sequelize.query(`SELECT id FROM GameLevels`, { type: queryInterface.sequelize.QueryTypes.SELECT })
    const recordList = []
    await usersId.forEach(user => {
      for (let i = 0; i < 30; i++) {
        let d = dayjs().subtract(Math.floor(Math.random() * 30), 'day').format()
        recordList.push({
          duration: (Math.floor(Math.random() * 10) + 20),
          point: 123,
          user_id: user.id,
          game_level_id: gameLevelId[Math.floor(Math.random() * gameLevelId.length)].id,
          created_at: d,
          updated_at: d
        })
      }
    })
    await queryInterface.bulkInsert('GameRecords', recordList, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameRecords', null, {});
  }
};
