import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

// const router = createBrowserRouter([
// 	{
// 		path: '/home',
// 		element: <App />
// 	}
// ]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* <RouterProvider router={router} /> */}
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
);
