const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Picture extends Model {}

Picture.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    data: {
      type: DataTypes.BLOB('medium'),
      allowNull: false
    },
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'room',
        key: 'id'
      },
      defaultValue: null
    },
    locationId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'location',
        key: 'id'
      },
      defaultValue: null
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'picture'
  }
);

module.exports = Picture;
