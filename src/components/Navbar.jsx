import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';
import logo from '../assets/logo/SNSU_Logo-Bg.png';

const Navbar = () => {
	return (
		<nav className='nav'>
			<NavLink to='/' className='site-title'>
				<img src={logo} alt='Logo' width={55} height={55} />
			</NavLink>
			<ul>
				<UserMenu />
			</ul>
		</nav>
	);
};

export default Navbar;
