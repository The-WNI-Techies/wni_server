import mongoose from "mongoose";

class DB {
    static async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }

    }
}

export default DB;