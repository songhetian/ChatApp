import { useChatStore } from '../store/useChatStore';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import Siderbar from '../components/Siderbar';

const HomePage = () => {
	const { selectedUser } = useChatStore();

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-2xl w-full max-w-6xl h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						<Siderbar />
						{!selectedUser ? <NoChatSelected /> : <ChatContainer />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
