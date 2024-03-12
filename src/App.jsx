import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import TemperatureGraph from './pages/TemperatureGraph';
import HumidityGraph from './pages/HumidityGraph';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className='container'>
				{/* <Navbar /> */}
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/temperature' element={<TemperatureGraph />} />
					<Route path='/humidity' element={<HumidityGraph />} />
					<Route path='login' element={<LoginPage />} />
				</Routes>
			</div>
		</QueryClientProvider>
	);
};

export default App;
