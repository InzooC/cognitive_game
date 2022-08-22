'use strict';



module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersId = await queryInterface.sequelize.query(`SELECT id FROM Users WHERE role = 'user'`, { type: queryInterface.sequelize.QueryTypes.SELECT })
    const gameLevelId = await queryInterface.sequelize.query(`SELECT id FROM GameLevels`, { type: queryInterface.sequelize.QueryTypes.SELECT })
    const recordList = []
    await usersId.forEach(user => {
      for (let i = 0; i < 10; i++) {
        recordList.push({
          duration: 123,
          point: 123,
          user_id: user.id,
          game_level_id: gameLevelId[Math.floor(Math.random() * gameLevelId.length)].id,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    })
    await queryInterface.bulkInsert('GameRecords', recordList, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameRecords', null, {});
  }
};
