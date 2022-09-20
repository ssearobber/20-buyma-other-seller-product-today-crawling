const { sequelize } = require('./models');
const { buyma } = require('./targetURLs/buyma');
require('dotenv').config();
const dayjs = require('dayjs');

// 3일에 한번씩 실행
let now = dayjs();
let date = now.get('D');
if (date % 3 != 0) {
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log('데이터베이스 연결 성공');
      buyma();
    })
    .catch((err) => {
      console.error(err);
    });
}
