'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    birthday: DataTypes.STRING,
    gender: DataTypes.STRING,
    classId: DataTypes.INTEGER,
    account: DataTypes.INTEGER,
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
    User.belongsTo(models.Class, { foreignKey: 'classId' })
  }
  return User;
};