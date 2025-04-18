#!/bin/bash
# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

rm -rf node_modules dist lambda.zip
yarn install --production
yarn build
zip -r lambda.zip dist node_modules

aws s3 cp lambda.zip s3://$BUCKET_NAME/development/lambda.zip --region us-east-1
rm -rf lambda.zip
yarn