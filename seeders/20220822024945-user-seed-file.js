'use strict';
const bcrypt = require('bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const accounts = []
    for (let i = 0; i < 3; i++) {
      let account = (Math.floor(Math.random() * 899) + 100)
      if (!accounts.includes(account)) {
        accounts.push(account)
      } else {
        i--
      }
    }
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 3 }).map((_, i) =>
      ({
        name: `user-${i}`,
        account: accounts[i],
        password: '123',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }))
      , {})
    await queryInterface.bulkInsert('Users',
      [{
        name: 'admin',
        account: 'admin123',
        // password: await bcrypt.hash('123', 10),
        password: '123',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }]
      , {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
