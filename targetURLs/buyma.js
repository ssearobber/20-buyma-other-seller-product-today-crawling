const puppeteer = require('puppeteer');
const dayjs = require('dayjs');

const TemporaryOtherSellerProductCount = require('../models/temporaryOtherSellerProductCount');
const OtherSellerProductTodayCount = require('../models/otherSellerProductTodayCount');
const OtherSellerProduct = require('../models/otherSellerProduct');
const sequelize = require('sequelize');
const Op = sequelize.Op;
require('dotenv').config();

// buyma 데이터 크롤링
async function buyma() {
  let startTime = new Date().getTime();
  const userId = process.env.USER_ID || userId;
  let browser = {};
  let page = {};

  try {
    // OtherSellerProduct테이블에서 데이터 취득
    console.log('OtherSellerProduct테이블의 다른판매자ID데이터 취득시작.');
    let objOfproductIdResultArr = [];
    try {
      objOfproductIdResultArr = await OtherSellerProduct.findAll({
        attributes: ['other_seller_id', 'buyma_product_id'],
      });
    } catch (e) {
      console.log('OtherSellerProduct select all error', e);
    }
    console.log('OtherSellerProduct테이블의 다른판매자ID데이터 취득종료.');

    // [{buyma_product_id: '123123'},{buyma_product_id: '123123'}...] ==> ['123123','123123'..]
    let productIdResultArr = [];
    for (productIdObj of objOfproductIdResultArr) {
      productIdResultArr.push(productIdObj.buyma_product_id);
    }

    let productIdResultArrSlice1;
    if (productIdResultArr.length) {
      productIdResultArrSlice1 = productIdResultArr.slice(0, productIdResultArr.length / 5);
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        // '--window-size=1920,1080',
        // '--disable-notifications',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    let totalProducts = [];
    let today = dayjs().format('YYYY/MM/DD');
    let tabOpenNum = Number(process.env.TAB_OPEN_NUM || tabOpenNum);
    for (let i = 0; i < productIdResultArrSlice1.length; i += tabOpenNum) {
      let sliceArray = productIdResultArrSlice1.slice(i, i + tabOpenNum);

      console.log(
        '현재 메모리 사용량(Promise.all 밖) ' +
          '\n' +
          'rss : ' +
          process.memoryUsage().rss / 1024 / 1024 +
          'MB' +
          '\n' +
          'heapTotal : ' +
          process.memoryUsage().heapTotal / 1024 / 1024 +
          'MB' +
          '\n' +
          'heapUsed : ' +
          process.memoryUsage().heapUsed / 1024 / 1024 +
          'MB' +
          '\n' +
          'external : ' +
          process.memoryUsage().external / 1024 / 1024 +
          'MB' +
          '\n' +
          'arrayBuffers : ' +
          process.memoryUsage().arrayBuffers / 1024 / 1024 +
          'MB',
      );
      await Promise.all(
        sliceArray.map(async (v) => {
          let page = await browser.newPage();
          // await page.setViewport({
          //   width: 1480,
          //   height: 1080,
          // });
          await page.setDefaultNavigationTimeout(0);
          let response = await page.goto(`https://www.buyma.com/item/${v}/`, {
            waitUntil: 'networkidle0',
            // timeout: 30000,
          });
          if (!response) {
            throw 'Failed to load page!';
          }

          // await page.waitForTimeout(20000); // 없으면 크롤링 안됨
          // 데이터 크롤링
          console.log(`https://www.buyma.com/item/${v}/ 페이지에 이동`);
          let buymaProductId = v;
          product = await page.evaluate(
            (today, buymaProductId) => {
              let product = {};
              product.buymaProductId = buymaProductId;
              product.buymaProductName = document.querySelector('#content h1').textContent;
              product.today = today;
              product.wish = document
                .querySelector('.topMenuWrap ul li:nth-of-type(2) span')
                .textContent.replace(/,|人/g, '');
              product.access = document
                .querySelector('.topMenuWrap ul li:nth-of-type(1) a')
                .textContent.replace(/,/g, '');
              product.link = `https://www.buyma.com/item/${buymaProductId}`;
              return product;
            },
            today,
            buymaProductId,
          );

          totalProducts.push(product);
          await page.close();
          console.log(`https://www.buyma.com/item/${v}/ 페이지 종료`);
        }),
      ).catch((err) => {
        console.log('Error in Promises.all: ', err);
      });
    }

    await browser.close();
    console.log('데이터 크롤링 종료.');

    // Op.gt: 초과 ,Op.gte: 이상 ,Op.lt: 미만 ,Op.lte: 이하 ,Op.ne: 같지않음 ,Op.or: 또는 ,Op.in: 배열 요소 중 하나 ,Op.notIn: 배열 요소와 모두 다름  --> [추가 2022/07/09]
    // console.log('ProductTodayCount테이블에 10일전 데이터 삭제시작.');
    // let before10Day = dayjs().subtract(10, 'd').format('YYYY/MM/DD');
    // try {
    //   await TemporaryProductCount.destroy({
    //     where: { today: { [Op.lte]: before10Day } },
    //     truncate: true,
    //   });
    // } catch (e) {
    //   console.log('delete error', e);
    // }
    // console.log('ProductTodayCount테이블에 10일전 데이터 삭제종료.');

    // ProductTodayCount테이블에 오늘 증가 데이터 등록
    console.log('OtherSellerProductTodayCount테이블에 증가데이터 입력시작.');
    let DBinsertStartTime = new Date().getTime();
    let wish = 0;
    let access = 0;
    for (let product of totalProducts) {
      if (product.buymaProductId) {
        try {
          let result = await TemporaryOtherSellerProductCount.findOne({
            where: { buyma_product_id: product.buymaProductId },
          });

          if (!result) {
          } else {
            wish = Number(product.wish) - Number(result.wish);
            access = Number(product.access) - Number(result.access);
          }

          let productResult = await OtherSellerProduct.findOne({
            where: { buyma_product_id: product.buymaProductId },
          });

          await OtherSellerProductTodayCount.upsert({
            other_seller_product_id: productResult.id,
            buyma_product_id: product.buymaProductId,
            buyma_product_name: product.buymaProductName,
            today: product.today,
            wish: wish,
            access: access,
            link: product.link,
            create_id: 'crawling',
            date_created: today,
            update_id: 'crawling',
            last_updated: today,
          });
        } catch (e) {
          console.log('오늘 증가 데이터 에러 : ', e);
        }
      }
    }
    let DBinsertEndTime = new Date().getTime();
    console.log(
      'OtherSellerProductTodayCount테이블 입력 총 걸린시간 : ' +
        DBinsertEndTime -
        DBinsertStartTime,
    );
    console.log('OtherSellerProductTodayCount테이블에 증가데이터 입력종료.');

    // 어제 데이터 삭제 (전체 데이터 삭제)
    console.log('TemporaryOtherSellerProductCount테이블의 어제 데이터 삭제시작.');
    try {
      await TemporaryOtherSellerProductCount.destroy({
        where: {},
        truncate: true,
      });
    } catch (e) {
      console.log('delete error', e);
    }
    console.log('TemporaryOtherSellerProductCount테이블의 어제 데이터 삭제종료.');
    // 오늘 데이터 등록
    console.log('TemporaryOtherSellerProductCount테이블에 오늘 데이터 등록시작.');
    let DBinsertStartTime2 = new Date().getTime();
    for (let product of totalProducts) {
      if (product.buymaProductId) {
        try {
          await TemporaryOtherSellerProductCount.upsert({
            buyma_product_id: product.buymaProductId,
            buyma_product_name: product.buymaProductName,
            today: product.today,
            wish: product.wish,
            access: product.access,
            create_id: 'crawling',
            date_created: today,
            update_id: 'crawling',
            last_updated: today,
          });
        } catch (e) {
          console.log('insert error', e);
        }
      }
    }
    let DBinsertEndTime2 = new Date().getTime();
    console.log(
      'OtherSellerProductTodayCount테이블 입력 총 걸린시간 : ',
      (((DBinsertEndTime2 - DBinsertStartTime2) / (1000 * 60)) % 60) + '분',
    );

    console.log('TemporaryOtherSellerProductCount테이블에 오늘 데이터 등록종료.');
    let endTime = new Date().getTime();
    console.log('총 걸린시간 : ', (((endTime - startTime) / (1000 * 60)) % 60) + '분');
  } catch (e) {
    console.log(e);
    await page.close();
    await browser.close();
  }
}

module.exports.buyma = buyma;
