const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FaceEmbedding = sequelize.define('FaceEmbedding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  embedding: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'JSON string of face embedding vector'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Base64 encoded face image'
  },
  quality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'face_embeddings',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = FaceEmbedding;