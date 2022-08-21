'use strict';
module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    level_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
    tableName: 'Levels',
    underscored: true
  });
  Level.associate = function (models) {
    // associations can be defined here
    Level.hasMany(models.GameLevel, { foreignKey: 'levelId' })
  };
  return Level;
};