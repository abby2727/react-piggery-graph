import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Random from './pages/Random';
import { Route, Routes } from 'react-router-dom';

const App = () => {
	return (
		<>
			<Navbar />
			<div className='container'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='pricing' element={<Pricing />} />
					<Route path='about' element={<About />} />
					<Route path='random' element={<Random />} />
				</Routes>
			</div>
		</>
	);
};

export default App;
