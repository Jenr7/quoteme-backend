'use strict';
const {
  Model
} = require('sequelize');

const users = require("./users");

module.exports = (sequelize, DataTypes) => {
  class quotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      quotes.belongsTo(models.users, {
        foreignKey: 'ownedBy',
        as: 'user'
      });
    }
  };
  quotes.init({
    content: DataTypes.STRING,
    quoted: DataTypes.STRING,
    ownedBy: {
      type: DataTypes.INTEGER,
      refrences: {
        model: users,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'quotes',
  });
  return quotes;
};