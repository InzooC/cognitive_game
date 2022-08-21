'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    game_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'Games',
    underscored: true
  });
  Game.associate = function (models) {
    // associations can be defined here
    Game.hasMany(models.GameLevel, { foreignKey: 'gameId' })

  };
  return Game;
};