const { sequelize } = require('./models');
const { buyma } = require('./targetURLs/buyma');
require('dotenv').config();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
    buyma();
  })
  .catch((err) => {
    console.error(err);
  });
