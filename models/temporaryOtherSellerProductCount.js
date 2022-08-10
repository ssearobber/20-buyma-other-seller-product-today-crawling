const Sequelize = require('sequelize');

module.exports = class TemporaryOtherSellerProductCount extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        buyma_product_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
          primaryKey: true,
        },
        buyma_product_name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        today: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        wish: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
        },
        access: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        modelName: 'TemporaryOtherSellerProductCount',
        tableName: 'temporary_other_seller_product_count',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }
};
