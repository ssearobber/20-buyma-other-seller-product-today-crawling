const Sequelize = require('sequelize');

module.exports = class OtherSellerProductTodayCount extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        other_seller_product_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        buyma_product_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
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
        link: {
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
        modelName: 'OtherSellerProductTodayCount',
        tableName: 'other_seller_product_today_count',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }
};
