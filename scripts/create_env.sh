#!/bin/env bash

echo "PORT=4000
NODE_ENV=DEVELOPMENT
ACCESS_SECRET=<access_secret>
REFRESH_SECRET=<refresh_secret>
MONGO_URI=<mongo_db_uri>
EMAIL_SERVICE=<mail_provider>
EMAIL_ADDRESS=
EMAIL_PASS=" > .env.development
