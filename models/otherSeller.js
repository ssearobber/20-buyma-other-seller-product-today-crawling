const Sequelize = require('sequelize');

module.exports = class OtherSeller extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        buyma_user_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        buyma_user_name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        buyma_home_url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        create_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        date_created: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        update_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        last_updated: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'OtherSeller',
        tableName: 'other_seller',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }
};
