import { NavLink } from 'react-router-dom';
import UserMenu from './UserMenu';
import logo from '../assets/logo/SNSU_Logo-Bg.png';
import { Divider } from '@mui/material';

const Navbar = () => {
	return (
		<nav>
			<div className='left-nav'>
				<div className='logo'>
					<img src={logo} alt='Logo' width={55} height={55} />
				</div>
				<NavLink className='nav-link' to='/ammonia'>
					Ammonia
				</NavLink>
				<NavLink className='nav-link' to='/temperature'>
					Temperature
				</NavLink>
				<NavLink className='nav-link' to='/humidity'>
					Humidity
				</NavLink>
				<Divider
					orientation='vertical'
					variant='middle'
					flexItem
					className='divider'
					sx={{ borderColor: 'white', marginLeft: '10px' }}
				/>
				<NavLink className='nav-link' to='/all-reading'>
					<span style={{ fontWeight: 500, fontSize: 17 }}>All</span>
				</NavLink>
			</div>
			<ul>
				<UserMenu />
			</ul>
		</nav>
	);
};

export default Navbar;
