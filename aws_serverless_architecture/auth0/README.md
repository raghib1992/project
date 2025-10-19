https://auth0.com/

Create account 


dev-huxllal1xgv3t0g1.eu.auth0.com

Register Application
app name is sls-cource
select single page app

add Allowed Callback URLs
Allowed Logout URLs
Allowed Web Origins
http://localhost:3000

Select in advance setting grant type -> password


Create user



curl --location --request POST 'https://dev-huxllal1xgv3t0g1.eu.auth0.com/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=71OkVnVGmVnQHxOCewOrgkVOYdwwnx1t' \
--data-urlencode 'username=udemy.zara@gmail.com' \
--data-urlencode 'password=Password@123#' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'scope=openid'