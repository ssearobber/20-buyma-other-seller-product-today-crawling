const Sequelize = require('sequelize');

module.exports = class OtherSellerProduct extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        other_seller_id: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        buyma_product_id: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        buyma_product_name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        category: {
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
        modelName: 'OtherSellerProduct',
        tableName: 'other_seller_product',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }
};
