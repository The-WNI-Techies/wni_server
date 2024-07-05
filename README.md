# THE WRITERS NETWORK INTERNATIONAL
Backend system for WNI's web platform

## GOALS

- Implement Schema Validation (prefarably using Joi; look into it)
- Better error handling.

## TO BE COMPLETED

- Finish sign-up functionality by sending out emails
- Add expires field to verification token model
- Try implementing catch-all error handler

## DATABASE && DB Schema

- Server configured to listen for request only when DB is running
- Mongoose used alongside mongosh locally or mongodb atlas in production through env variables.
- User schema and permissions (up next)
- Sign up and sign in implemented
