import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { months } from '../constants/months';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuery } from 'react-query';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Home = () => {
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

	//* ========== CHART 1
	const chartRef = useRef(null);
	const myChartRef = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			const ctx = chartRef.current.getContext('2d');
			const transformedData = transformObject(ammoniaValue?.data);

			myChartRef.current = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: getAmmoniaLabels(transformedData),
					// labels: ['test 1', 'test 2', 'test 3'],
					datasets: [
						{
							label: 'Ammonia Levels (mg/L)',
							data: getAmmoniaAverageValues(transformedData),
							// data: [1, 2, 3],
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
	}, [ammoniaValue?.data]);

	//* ========== CHART 2
	const chartRef2 = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			const ctx2 = chartRef2.current.getContext('2d');
			const transformedData = transformObject(ammoniaValue?.data);

			const myChart2 = new Chart(ctx2, {
				type: 'bar',
				data: {
					labels: [],
					datasets: [
						{
							label: '',
							data: getAmmoniaAverageValues(transformedData)
							// data: [1, 2, 3]
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
	}, [ammoniaValue?.data]);

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
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker /> <span className='dash' />
						<DatePicker />
					</LocalizationProvider>
				</LocalizationProvider>
			</div>
			<div className='chartCard'>
				{!isLoading ? (
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
