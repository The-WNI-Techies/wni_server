declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'DEVELOPMENT' | 'TESTING' | 'PRODUCTION';
        PORT?: string;
        MONGO_URI: string;
        ACCESS_SECRET: string;
        REFRESH_SECRET: string;
    }
}