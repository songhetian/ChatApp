import toast from 'react-hot-toast';
import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface ChatState {
	messages: Message[];
	users: User[];
	selectedUser: User | null;
	isUsersLoading: boolean;
	isMessagesLoading: boolean;
	getUsers: () => Promise<void>;
	getMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User) => Promise<void>;
	sendMessage: (data: { text: string; receiverId: string }) => Promise<void>;
}

type Message = {
	content: string;
	senderId: string;
	receiverId: string;
	createdAt: string;
};

type User = {
	_id: string;
	email: string;
	fullName: string;
	profilePic: string;
};

export const useChatStore = create<ChatState>((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,
	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const res = await axiosInstance.get('/message/users');
			set({ users: res.data });
			toast.success('获取用户列表成功'); // 修改为中文
		} catch (error: any) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUsersLoading: false });
		}
	},
	getMessages: async (userId: string) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/message/${userId}`);
			set({ messages: res.data });
			toast.success('获取消息记录成功'); // 修改为中文
		} catch (error: any) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},
	setSelectedUser: async (user: User) => {
		set({ selectedUser: user });
	},
	sendMessage: async messageData => {
		const { selectedUser, messages } = get();
		try {
			const res = await axiosInstance.post(
				`/message/send/${selectedUser?._id}`,
				messageData
			);
			set({ messages: [...messages, res.data] });
			toast.success('发送消息成功'); // 修改为中文
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	}
}));
