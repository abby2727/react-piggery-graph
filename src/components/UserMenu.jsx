import { useContext, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { Paper, Typography } from '@mui/material';
import { AuthContext } from '../App'; // import AuthContext

const UserMenu = () => {
	const [logoutAnchor, setLogoutAnchor] = useState(null);
	const [notificationAnchor, setNotificationAnchor] = useState(null);
	const logoutOpen = Boolean(logoutAnchor);
	const notificationOpen = Boolean(notificationAnchor);
	const id = open ? 'simple-popover' : undefined;

	const { setIsLoggedIn } = useContext(AuthContext); // use AuthContext

	const handleClick = (event, name) => {
		if (name === 'logout') setLogoutAnchor(event.currentTarget);
		if (name === 'notification') setNotificationAnchor(event.currentTarget);
	};

	const handleClose = (name) => {
		if (name === 'logout') setLogoutAnchor(null);

		if (name === 'notification') setNotificationAnchor(null);
	};

	const handleLogout = () => {
		setLogoutAnchor(null);
		setIsLoggedIn(false);
	};

	return (
		<>
			<button
				aria-describedby={id}
				variant='contained'
				onClick={(event) => handleClick(event, 'notification')}
			>
				<NotificationsIcon className='icon' />
			</button>
			<button
				id='logout-button'
				aria-controls={logoutOpen ? 'logout-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={logoutOpen ? 'true' : undefined}
				onClick={(event) => handleClick(event, 'logout')} // call handleClick with 'logout'
			>
				<AccountCircleIcon className='icon' />
			</button>

			<Menu
				id='logout-menu'
				anchorEl={logoutAnchor}
				open={logoutOpen}
				onClose={() => handleClose('logout')}
				MenuListProps={{
					'aria-labelledby': 'logout-button'
				}}
			>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>

			<Popover
				id={id}
				open={notificationOpen}
				anchorEl={notificationAnchor}
				onClose={() => handleClose('notification')}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
			>
				<Paper sx={{ p: 2 }}>
					<Typography>New Notification 1</Typography>
					<Typography>New Notification 2</Typography>
					<Typography>New Notification 3</Typography>
				</Paper>
			</Popover>
		</>
	);
};

export default UserMenu;
