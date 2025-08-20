#!/bin/bash
# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | xargs)
fi

STAGE=$1
if [ -z "$STAGE" ]; then
    echo "Usage: $0 <stage>"
    exit 1
fi

rm -rf node_modules dist lambda.zip
yarn install
yarn build
cp viewer.html dist/viewer.html 
zip -r lambda.zip dist node_modules

aws s3 cp lambda.zip s3://$BUCKET_NAME/$STAGE/lambda.zip --region us-east-1
rm -rf lambda.zip
yarn