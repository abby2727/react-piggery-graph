import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Home = () => {
	//* ========== CHART 1
	const chartRef = useRef(null);
	const myChartRef = useRef(null);

	useEffect(() => {
		const ctx = chartRef.current.getContext('2d');
		myChartRef.current = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: [
					'Mon',
					'Tue',
					'Wed',
					'Thu',
					'Fri',
					'Sat',
					'Sun',
					'Mon',
					'Tue',
					'Wed',
					'Thu',
					'Fri',
					'Sat',
					'Sun'
				],
				datasets: [
					{
						label: 'Weekly Sales',
						data: [18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3, 9],
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
	}, []);

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
						data: myChartRef.current.data.datasets[0].data
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
	}, []);

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
