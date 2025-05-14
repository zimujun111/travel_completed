const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RejectReason = sequelize.define('RejectReason', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'travel_notes',
      key: 'note_id'
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'note_reject_reasons'
});

module.exports = RejectReason;