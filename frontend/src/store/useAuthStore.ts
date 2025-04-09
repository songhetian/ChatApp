import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

// 用户认证信息类型
export interface AuthUser {
	_id: string;
	email: string;
	fullName: string;
	profilePic: string;
	createdAt: string;
}
// 添加注册数据类型
export interface SignupData {
	fullName: string;
	email: string;
	password: string; // 添加密码字段
}

// 认证状态存储类型
export interface AuthState {
	authUser: AuthUser | null;
	isSigningUp: boolean;
	isSigningIn: boolean;
	isUpdatingProfile: boolean;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	onlineUsers: string[];
	checkAuth: () => Promise<void>;
	signup: (data: SignupData) => Promise<void>;
	login: (data: { email: string; password: string }) => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (data: { profilePic: string }) => Promise<void>;
}

const useAuthStore = create<AuthState>(set => ({
	authUser: null,
	isSigningUp: false,
	isSigningIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: false,
	isLoggingIn: false,
	onlineUsers: [],
	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check');
			set({ authUser: res.data });
		} catch (error) {
			set({ authUser: null });
			console.log(error);
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	signup: async (data: SignupData) => {
		try {
			set({ isSigningUp: true });

			const res = await axiosInstance.post('/auth/signup', data);
			set({ authUser: res.data });
			toast.success('Signup successful');
		} catch (error: any) {
			set({ authUser: null });
			toast.error(error.response.data.message);
		} finally {
			set({ isSigningUp: false });
		}
	},
	login: async (data: { email: string; password: string }) => {
		try {
			set({ isSigningIn: true });
			const res = await axiosInstance.post('/auth/login', data);
			set({ authUser: res.data });
			toast.success('Login successful');
		} catch (error: any) {
			set({ authUser: null });
			toast.error(error.response.data.message);
		} finally {
			set({ isSigningIn: false });
		}
	},
	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout');
			set({ authUser: null });
		} catch (error) {
			console.log(error);
		}
	},
	updateProfile: async data => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axiosInstance.put('/auth/update-profile', data);
			set({ authUser: res.data });
			toast.success('Profile updated successfully');
		} catch (error) {
			console.log(error);
			toast.error('Failed to update profile');
		} finally {
			set({ isUpdatingProfile: false });
		}
	}
}));

export default useAuthStore;
