invoke_url=$(terraform output invoke_url)
invoke_url=$(echo $invoke_url | tr -d '"')

# https://global-norte.s3.amazonaws.com/dashboard/6495dabc599fea2ab32ff48b/images/29202da1bf58c6b9b2d1379b8463f0b1-GSAI4554.JPG
image_url = 
curl "${invoke_url}/analysis?imageUrl=https://global-norte.s3.amazonaws.com/dashboard/6495dabc599fea2ab32ff48b/images/d37d9a4d0d7f543de156076c4e2f4816-GSAI4530.JPG"