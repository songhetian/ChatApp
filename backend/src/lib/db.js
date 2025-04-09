import mongoose from "mongoose";

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("数据库连接成功");

    } catch (error) {
        console.log("出现错误");

    }
}

export default connectDB;