const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('image', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'images',
  timestamps: false,
  underscored: true
});

module.exports = Image; 