# THE WRITERS NETWORK INTERNATIONAL
Backend system for WNI's web platform

## GOALS

- Implement auth middlewares `canResetPassword`, `requireAuth`, `requireVerification`


## DATABASE && DB Schema

- Server configured to listen for request only when DB is running
- Mongoose used alongside mongosh locally or mongodb atlas in production through env variables.
- User schema and permissions (up next)
- Sign up and sign in implemented
- Reset Password and VerifyUser implemented

## HOW TO USE
- Response: `error` field for error && success field for `successful` api calls
