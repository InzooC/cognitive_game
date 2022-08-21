'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameLevel = sequelize.define('GameLevel', {
  }, {
    sequelize,
    modelName: 'GameLevel',
    tableName: 'GameLevels',
    underscored: true
  });

  GameLevel.associate = function (models) {
    // associations can be defined here
    GameLevel.hasMany(models.GameRecord, { foreignKey: 'gameLevelId' })

    GameLevel.belongsTo(models.Game, { foreignKey: 'gameId' })
    GameLevel.belongsTo(models.Level, { foreignKey: 'levelId' })
  };
  return GameLevel;
};