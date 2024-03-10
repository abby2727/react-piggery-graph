import Navbar from './components/Navbar';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div className='container'>
				<Navbar />
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</div>
		</QueryClientProvider>
	);
};

export default App;
