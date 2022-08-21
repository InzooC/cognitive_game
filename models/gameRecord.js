'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameRecord = sequelize.define('GameRecord', {
    duration: DataTypes.STRING,
    point: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    gameLevelId: DataTypes.INTEGER
  }, {
    modelName: 'GameRecord',
    tableName: 'GameRecords',
    underscored: true
  });
  GameRecord.associate = function (models) {
    // associations can be defined here
    GameRecord.belongsTo(models.User, { foreignKey: 'userId' })
    GameRecord.belongsTo(models.GameLevel, { foreignKey: 'gameLevelId' })
  };
  return GameRecord;
};