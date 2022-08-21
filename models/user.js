'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    age: DataTypes.STRING,
    gender: DataTypes.STRING,
    dx: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
  });
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.GameRecord, { foreignKey: 'userId' })
  }
  return User;
};