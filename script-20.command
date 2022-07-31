#!/bin/sh
echo "heroku deploy";
cd /Users/samugari/Desktop/localGit/20-buyma-other-seller-product-today-crawling;
git add .;
git commit -m "script commit";
git push origin master;
git push heroku master;