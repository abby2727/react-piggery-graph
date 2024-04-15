import React, { useContext, useEffect, useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import LoginHeader from '../components/LoginHeader';
import LoginFooter from '../components/LoginFooter';

const LoginPage = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginFailed, setLoginFailed] = useState(false);

	const { setIsLoggedIn } = useContext(AuthContext);
	const credentials = {
		username: 'researcher1',
		password: 'Thesis!2024'
	};

	const handleLogin = (event) => {
		event.preventDefault();
		if (
			username === credentials.username &&
			password === credentials.password
		) {
			setIsLoggedIn(true);
		} else {
			setLoginFailed(true);
		}
	};

	useEffect(() => {
		navigate('/');
	}, []);

	return (
		<>
			<LoginHeader />
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='calc(100vh - 209px)'
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
					<Typography variant='body1' align='center'>
						<span style={{ fontSize: '30px', fontWeight: 520 }}>
							Sign in
						</span>
					</Typography>
					{loginFailed && (
						<Typography
							variant='h6'
							align='center'
							style={{ color: 'red' }}
							sx={{ fontSize: '1rem' }}
						>
							Invalid username or password
						</Typography>
					)}
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
							error={loginFailed}
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
							error={loginFailed}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{
								backgroundColor: '#a64d4d',
								marginTop: '1rem'
							}}
						>
							Login
						</Button>
					</form>
				</Container>
			</Box>
			<LoginFooter />
		</>
	);
};

export default LoginPage;
