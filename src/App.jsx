import React, { useState, createContext, useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import TemperatureGraph from './pages/TemperatureGraph';
import HumidityGraph from './pages/HumidityGraph';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();

export const AuthContext = createContext();

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const saved = localStorage.getItem('isLoggedIn');
		const initialValue = JSON.parse(saved);
		return initialValue || false;
	});

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (isLoggedIn && location.pathname === '/login') {
			navigate('/');
		}
	}, [isLoggedIn, location, navigate]);

	useEffect(() => {
		localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
	}, [isLoggedIn]);

	const routing = useRoutes([
		{ path: '/', element: isLoggedIn ? <Home /> : <LoginPage /> },
		{
			path: '/temperature',
			element: isLoggedIn ? <TemperatureGraph /> : <LoginPage />
		},
		{
			path: '/humidity',
			element: isLoggedIn ? <HumidityGraph /> : <LoginPage />
		},
		{ path: '/login', element: <LoginPage /> }
	]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			<QueryClientProvider client={queryClient}>
				<div className='container'>
					{isLoggedIn && <Navbar />}
					{routing}
				</div>
			</QueryClientProvider>
		</AuthContext.Provider>
	);
};

export default App;
