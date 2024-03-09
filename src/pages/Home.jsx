import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { months } from '../constants/months';

const Home = () => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = async () => {
		const res = await axios.get('http://localhost:3000/ammonia/');
		setData(res.data);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

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
	console.log('transformObject:', transformObject(data));

	function getAmmoniaAverageValues(data) {
		let values = Object.values(data).map((value) => value);
		return values;
	}
	console.log(
		'getAmmoniaAverageValues:',
		getAmmoniaAverageValues(transformObject(data))
	);

	const getAmmoniaLabels = (data) => {
		let formattedDates = Object.keys(data).map((date) => {
			let [year, month, day] = date.split('-');
			return `${day}, ${months[parseInt(month) - 1]}`;
		});

		return formattedDates;
	};
	console.log('getAmmoniaLabels:', getAmmoniaLabels(transformObject(data)));

	//* ========== CHART 1
	const chartRef = useRef(null);
	const myChartRef = useRef(null);

	useEffect(() => {
		const ctx = chartRef.current.getContext('2d');
		myChartRef.current = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: [
					'08, March',
					'09, March',
					'10, March',
					'11, March',
					'12, March',
					'13, March',
					'14, March'
				],
				datasets: [
					{
						label: 'Ammonia Levels (mg/L)',
						data: [18, 20, 22, 24, 26, 28, 30],
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
	}, [data]);

	//* ========== CHART 2
	const chartRef2 = useRef(null);

	useEffect(() => {
		const ctx2 = chartRef2.current.getContext('2d');
		const myChart2 = new Chart(ctx2, {
			type: 'bar',
			data: {
				labels: [],
				datasets: [
					{
						label: '',
						data: [18, 20, 22, 24, 26, 28, 30]
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
	}, [data]);

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
		<div className='chartCard'>
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
		</div>
	);
};

export default Home;
