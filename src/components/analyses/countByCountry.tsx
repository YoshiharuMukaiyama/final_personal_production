import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Fighter = {
  wins: string;
  losses: string;
  placeOfBirth?: string;  // 出身地（都市名, 国名）
  winningRate?: number;
};

export const CountByCountry = () => {
  const [countByCountryData, setCountByCountryData] = useState<
    { country: string; count: number; averageWinningRate: number }[]
  >([]);

  const extractCountry = (place: string): string => {
    if (!place) return 'Others';
    const parts = place.split(',');
    if (parts.length < 2) return place.trim();
    return parts[parts.length - 1].trim();
  };

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        const statsByCountry: { [country: string]: { totalWinningRate: number; count: number } } = {};

        fightersArray.forEach(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const winningRate = wins + losses > 0 ? wins / (wins + losses) : 0;

          const country = extractCountry(fighter.placeOfBirth || '');

          if (!statsByCountry[country]) statsByCountry[country] = { totalWinningRate: 0, count: 0 };

          statsByCountry[country].totalWinningRate += winningRate;
          statsByCountry[country].count += 1;
        });

        const countArray = Object.entries(statsByCountry)
          .map(([country, { totalWinningRate, count }]) => ({
            country,
            count,
            averageWinningRate: count > 0 ? totalWinningRate / count : 0,
          }))
          .sort((a, b) => {
            if (a.country === 'Others') return 1;
            if (b.country === 'Others') return -1;
            return b.averageWinningRate - a.averageWinningRate;
          })
          .slice(0, 20);

        setCountByCountryData(countArray);
      })
      .catch(error => console.error(error));
  }, []);

  const maxCount = countByCountryData.length > 0
    ? Math.max(...countByCountryData.map(item => item.count))
    : 10;

  const chartData = {
    labels: countByCountryData.map(item => item.country),
    datasets: [
      {
        label: '人数',
        data: countByCountryData.map(item => item.count),
        backgroundColor: '#435d86ff',
        borderColor: '#435d86ff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: { padding: { top: 30, bottom: 30, left: 50, right: 50 } },
    scales: {
      y: {
        min: 0,
        max: maxCount + 5,
        title: {
          display: true,
          text: '人数', // 縦軸ラベル
          font: { size: 14 },
        },
        ticks: { stepSize: 5 },
      },
      x: {
        title: {
          display: true,
          text: '出身国',
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const item = countByCountryData[index];
            return `人数: ${item.count}, 平均勝率: ${(item.averageWinningRate * 100).toFixed(1)}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '90vw', height: '70vh', margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
