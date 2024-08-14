declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'DEVELOPMENT' | 'TESTING' | 'PRODUCTION';
        PORT?: string;
        MONGO_URI: string;
        ACCESS_SECRET: string;
        REFRESH_SECRET: string;
        EMAIL_SERVICE: string;
        EMAIL_ADDRESS: string;
        EMAIL_PASS: string;
        CORS_ORIGIN: string;
    }
}