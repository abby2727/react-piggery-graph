import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';

const Navbar = () => {
	return (
		<nav className='nav'>
			<NavLink to='/' className='site-title'>
				Logo
			</NavLink>
			<ul>
				<UserMenu />
			</ul>
		</nav>
	);
};

export default Navbar;
