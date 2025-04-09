import mongoose from 'mongoose';
import { type } from 'os';

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId,  ref: "User", }, // 发送者的ID，关联到User模型
    receiverId: { type: mongoose.Schema.Types.ObjectId,  ref: "User", }, // 接收者的ID，关联到User模型
    text: { type: String, required: true }, // 消息内容，必填
    image : {type:String} // 消息图片
},{
    timestamps: true // 自动添加创建时间和更新时间戳，方便查询和排序
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
