#!/bin/env bash

echo "PORT=4000
NODE_ENV=DEVELOPMENT
ACCESS_SECRET=<access_secret>
REFRESH_SECRET=<refresh_secret>
MONGO_URI=<mongo_db_uri>
EMAIL_SERVICE=<mail_provider>
EMAIL_ADDRESS=<email_address>
EMAIL_PASS=<email_passkey>
CORS_ORIGIN=<client_app_address>" > .env
