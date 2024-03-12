import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AuthContext } from '../App';

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const { setIsLoggedIn } = useContext(AuthContext);

	const handleLogin = (event) => {
		event.preventDefault();
		// Handle login logic here
		console.log(`Username: ${username}, Password: ${password}`);
		setIsLoggedIn(true);
	};

	return (
		<Box
			display='flex'
			justifyContent='center'
			alignItems='center'
			minHeight='100vh'
			bgcolor='#e9ecef'
		>
			<Container
				maxWidth='xs'
				sx={{
					padding: 3,
					borderRadius: 4,
					backgroundColor: '#fff'
				}}
			>
				<Typography variant='h4' align='center'>
					Sign in
				</Typography>
				<form onSubmit={handleLogin}>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						id='username'
						label='Username'
						name='username'
						autoComplete='username'
						autoFocus
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						type='password'
						id='password'
						autoComplete='current-password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						style={{ marginTop: '1rem' }}
					>
						Login
					</Button>
				</form>
			</Container>
		</Box>
	);
};

export default LoginPage;
