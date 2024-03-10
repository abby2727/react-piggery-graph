import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { months } from '../constants/months';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery } from 'react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import CustomSnackbar from '../components/CustomSnackbar';

const Home = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isDateRangeApplied, setIsDateRangeApplied] = useState(false);
	const [filteredAmmoniaValue, setFilteredAmmoniaValue] = useState([]);
	const [filterLoading, setFilterLoading] = useState(false);
	const [dateError, setDateError] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);

	const { isLoading, data: ammoniaValue } = useQuery(
		'ammonia-data',
		() => {
			return axios.get('http://localhost:3000/ammonia/');
		},
		{ staleTime: 10 * 60 * 1000 } // refetch only after 10 minutes
	);

	const transformObject = (data) => {
		let groupedData = {};

		// Group data by date
		data.forEach((item) => {
			let date = item.created_at.split(' ')[0]; // get the date part of the timestamp
			if (!groupedData[date]) {
				groupedData[date] = [];
			}
			groupedData[date].push(item.value);
		});

		// Calculate average value for each date
		for (let date in groupedData) {
			let sum = groupedData[date].reduce((a, b) => a + b, 0);
			let avg = sum / groupedData[date].length;
			groupedData[date] = avg.toFixed(2);
		}

		return groupedData;
	};

	const getAmmoniaAverageValues = (data) => {
		let values = Object.values(data).map((value) => value);
		return values;
	};

	const getAmmoniaLabels = (data) => {
		let formattedDates = Object.keys(data).map((date) => {
			let [year, month, day] = date.split('-');
			return `${day}, ${months[parseInt(month) - 1]}`;
		});

		return formattedDates;
	};

	const filterDataByDateRange = (data, startDate, endDate) => {
		if (startDate && endDate) {
			setFilterLoading(true);
			const start = new Date(startDate);
			const end = new Date(endDate);

			start.setHours(0, 0, 0, 0);
			end.setHours(0, 0, 0, 0);

			const filteredData = data.filter((item) => {
				const createdAt = new Date(item.created_at);
				createdAt.setHours(0, 0, 0, 0);
				return createdAt >= start && createdAt <= end;
			});

			setFilterLoading(false);
			return filteredData;
		}
	};

	const handleSubmit = () => {
		if (startDate && endDate) {
			const startDateObj = new Date(startDate);
			const endDateObj = new Date(endDate);

			// Validate that the start date is not later than the end date
			if (startDateObj > endDateObj) {
				setSnackbarOpen(true);
				setDateError(true);
				return;
			}

			const utcStartDate = new Date(
				startDateObj.getTime() -
					startDateObj.getTimezoneOffset() * 60000
			);
			const utcEndDate = new Date(
				endDateObj.getTime() - endDateObj.getTimezoneOffset() * 60000
			);

			const formattedStartDate = utcStartDate.toISOString().split('T')[0];
			const formattedEndDate = utcEndDate.toISOString().split('T')[0];
			const filteredAmmoniaData = filterDataByDateRange(
				ammoniaValue?.data,
				formattedStartDate,
				formattedEndDate
			);

			setFilteredAmmoniaValue(filteredAmmoniaData);
			setIsDateRangeApplied(true);
			setDateError(false);
			setSnackbarOpen(false);
		}
	};

	const handleClear = () => {
		setStartDate(null);
		setEndDate(null);
		setIsDateRangeApplied(false);
		setDateError(false);
		setSnackbarOpen(false);
	};

	//* ========== CHART 1
	const chartRef = useRef(null);
	const myChartRef = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			const ctx = chartRef.current.getContext('2d');
			const transformedData = isDateRangeApplied
				? transformObject(filteredAmmoniaValue)
				: transformObject(ammoniaValue?.data);

			myChartRef.current = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: getAmmoniaLabels(transformedData),
					datasets: [
						{
							label: 'Ammonia Levels (mg/L)',
							data: getAmmoniaAverageValues(transformedData),
							backgroundColor: ['rgba(255, 206, 86, 0.2)'],
							borderColor: ['rgba(255, 206, 86, 1)'],
							borderWidth: 1
						}
					]
				},
				//* ========== CHART 1 OPTIONS
				options: {
					maintainAspectRatio: false,
					layout: {
						padding: {
							top: 10,
							bottom: 10
						}
					},
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								display: false
							},
							grid: {
								drawTicks: false,
								drawBorder: false
							}
						}
					},
					plugins: {
						legend: {
							display: false
						}
					}
				}
			});

			return () => myChartRef.current.destroy();
		}
	}, [ammoniaValue?.data, filteredAmmoniaValue, isDateRangeApplied]);

	//* ========== CHART 2
	const chartRef2 = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			const ctx2 = chartRef2.current.getContext('2d');
			const transformedData = isDateRangeApplied
				? transformObject(filteredAmmoniaValue)
				: transformObject(ammoniaValue?.data);

			const myChart2 = new Chart(ctx2, {
				type: 'bar',
				data: {
					labels: [],
					datasets: [
						{
							label: '',
							data: getAmmoniaAverageValues(transformedData)
						}
					]
				},
				//* ========== CHART 2 OPTIONS
				options: {
					maintainAspectRatio: false,
					layout: {
						padding: {
							bottom: 56
						}
					},
					scales: {
						x: {
							ticks: {
								display: false
							},
							grid: {
								drawTicks: false
							}
						},
						y: {
							beginAtZero: true,
							afterFit: (ctx) => {
								ctx.width = 40;
							}
						}
					},
					plugins: {
						legend: {
							display: false
						}
					}
				}
			});

			return () => myChart2.destroy();
		}
	}, [ammoniaValue?.data, filteredAmmoniaValue, isDateRangeApplied]);

	const boxRef = useRef(null);
	const [barLength, setBarLength] = useState(0);

	useEffect(() => {
		if (myChartRef.current) {
			setBarLength(myChartRef.current.data.labels.length);
		}
	}, [myChartRef.current]);

	useEffect(() => {
		if (barLength > 7) {
			const chartWidth = 1000 + (barLength - 7) * 30;
			boxRef.current.style.width = `${chartWidth}px`;
		}
	}, [barLength]);

	return (
		<>
			<div className='date-picker'>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DatePicker
						value={startDate}
						onChange={setStartDate}
						className={dateError ? 'datepicker-error' : ''}
					/>
					<span className='dash' />
					<DatePicker value={endDate} onChange={setEndDate} />
					<Button
						variant='contained'
						color='primary'
						onClick={handleSubmit}
						disabled={!startDate || !endDate}
						className='button'
					>
						Submit
					</Button>
					<Button
						variant='outlined'
						color='secondary'
						onClick={handleClear}
						disabled={!startDate && !endDate}
						className='button'
					>
						Clear
					</Button>
				</LocalizationProvider>
			</div>
			<CustomSnackbar
				open={snackbarOpen}
				handleClose={() => setSnackbarOpen(false)}
				message='The start date cannot be later than the end date.'
			/>
			<div className='chartCard'>
				{!isLoading || filterLoading ? (
					<>
						<div className='chartBox'>
							<div className='colSmall'>
								<canvas ref={chartRef2} />
							</div>
							<div className='colLarge'>
								<div className='box' ref={boxRef}>
									<canvas ref={chartRef} />
								</div>
							</div>
						</div>
					</>
				) : (
					<LoadingSpinner />
				)}
			</div>
		</>
	);
};

export default Home;
