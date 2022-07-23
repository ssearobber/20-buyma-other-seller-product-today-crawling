const Sequelize = require('sequelize');
const OtherSeller = require('./otherSeller');
const TemporaryOtherSellerProductCount = require('./temporaryOtherSellerProductCount');
const OtherSellerProductTodayCount = require('./otherSellerProductTodayCount');
const OtherSellerProduct = require('./otherSellerProduct');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.OtherSeller = OtherSeller;
db.OtherSellerProduct = OtherSellerProduct;
db.OtherSellerProductTodayCount = OtherSellerProductTodayCount;
db.TemporaryOtherSellerProductCount = TemporaryOtherSellerProductCount;

OtherSeller.init(sequelize);
OtherSellerProduct.init(sequelize);
OtherSellerProductTodayCount.init(sequelize);
TemporaryOtherSellerProductCount.init(sequelize);

// Product.associate(db);

module.exports = db;
