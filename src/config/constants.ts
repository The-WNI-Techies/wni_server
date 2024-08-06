export const tokens = {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES : 60 * 15,
    REFRESH_TOKEN_EXPIRES : 60 * 60 * 24 * 30,
    get REFRESH_COOKIE_EXPIRES() {
        return this.REFRESH_TOKEN_EXPIRES  * 1000
    }
    
}