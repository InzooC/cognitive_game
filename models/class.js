'use strict';
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Class',
    tableName: 'Classes',
    underscored: true,
  });
  Class.associate = function (models) {
    // associations can be defined here
    Class.hasMany(models.User, { foreignKey: 'classId' })
  };
  return Class;
};