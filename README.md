# THE WRITERS NETWORK INTERNATIONAL
Backend system for WNI's web platform

## HOW TO SETUP
- Make sure you have a Javascript runtime and a Typescript compiler. (Bun, Node.js, Deno && tsc)
- Make sure you have npm installed or you are using the Bun runtime
- Make sure you have properly set up your mongo db server and obtained a connection string
- Create a .env file in the root of the project dir and add the following:
```sh
ENVIRONMENT=DEVELOPMENT
ACCESS_SECRET=<your-access-secret>
REFRESH_SECRET=<your-refresh-secret>
MONGO_URI=<your_mongo_db_connection_string>
```
- Install dependencies:
> Using Bun
```sh
bun install
```
> Using NPM
```sh
npm install
```
- Run the Development server
> Using Bun
```sh
bun run dev
```
> Using NPM and typescript Compiler
```sh
npm run node_dev
```
Or better still **setup** your own configuration for hot-reloading
## GOALS

- Make `reset-password` atomic
- Handle image upload efficiently
- Create a distinct web-socket server for managing chat
- Cascade user rooms and messages or set to null if user is deleted

## BUGS
[None](https://adeyemiabiade.vercel.app)

## DATABASE && DB Schema

- Server configured to listen for request only when DB is running
- Mongoose used alongside mongosh locally or mongodb atlas in production through env variables.
- User schema and permissions (up next)
- Sign up and sign in implemented
- Reset Password and VerifyUser implemented

## HOW TO USE
- Response: `error` field for error && `success` field for successful api calls


### AUTH Routes
All authentication routes start with the auth route fragemnt like so currently there are six route fragments.

The first one is the `/register` endpoint that allows the user to register to the app.
It requires a `username`, `password` and `email` fields in the request body.

E.g. to create a new user using the javascript fetch API we'll have something like this:
```ts
async function fetchData() {
    const responseData: object | null = null;
    try{
        const res = await fetch(`<domain_name>/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors' // For cross-site request,
            credentials: 'include', // for any credentials set like cookie, though there is none for now.
            body: JSON.stringify({ username, email, password }) // Parse user data as json
        });

        const data = await res.json();
        responseData = data;
        /* 
        Returns an object with either error or success as one of the keys 
        and any other number of keys depending on the state of the request.
        E.g. for error we cna have {error: 'Internal server error'}
        for success { success; 'User created successfully', short_id: 'SDFH12hhxddeifAS803NSFIGFhsdf' }
        */
        }
        catch(error) {
            handleError(error)
        }
        return responseData;
}
```

### PROJECT STRUCTURE
```sh
.
├── bun.lockb
├── package.json
├── README.md
├── src
│   ├── app.ts
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.middlewares.ts
│   │   ├── auth.model.ts
│   │   └── auth.routes.ts
│   ├── chat
│   │   ├── chat.controller.ts
│   │   ├── chat.model.ts
│   │   ├── chat.routes.ts
│   │   └── chat.service.ts
│   ├── config
│   │   └── constants.ts
│   ├── emails
│   │   ├── email.service.ts
│   │   └── templates
│   │       ├── password_reset.html
│   │       └── verification_email.html
│   ├── interfaces
│   │   ├── IAppRequest.ts
│   │   ├── IChatRoom.ts
│   │   └── IUser.ts
│   ├── user
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   └── user.service.ts
│   └── validation
│       ├── roomValidation.ts
│       └── userValidation.ts
└── tsconfig.json

```
