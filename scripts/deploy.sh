#!/bin/bash
rm -rf node_modules dist lambda.zip
yarn install --production
yarn build
zip -r lambda.zip dist node_modules
terraform apply
yarn