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
  placeOfBirth?: string;
  winningRate?: number;
};

export const WinningRateByCountry = () => {
  const [averageByCountry, setAverageByCountry] = useState<{ country: string; averageWinningRate: number; count: number }[]>([]);

  const extractCountry = (place: string): string => {
    if (!place) return 'Others';
    const parts = place.split(',');
    if (parts.length < 2) return place.trim();
    return parts[parts.length - 1].trim();
  };

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const fightersArray = Object.values(response.data) as Fighter[];

        const stats = fightersArray.map(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const country = extractCountry(fighter.placeOfBirth || '');
          return {
            country,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
            count: 1,
          };
        });

        const countryGroups: { [country: string]: { totalRate: number; count: number } } = {};
        stats.forEach(fighter => {
          const country = fighter.country || 'Others';
          if (!countryGroups[country]) countryGroups[country] = { totalRate: 0, count: 0 };
          countryGroups[country].totalRate += fighter.winningRate ?? 0;
          countryGroups[country].count += 1;
        });

        const averageData = Object.entries(countryGroups).map(([country, { totalRate, count }]) => ({
          country,
          averageWinningRate: count > 0 ? totalRate / count : 0,
          count,
        }))
          .sort((a, b) => {
            if (a.country === 'Others') return 1;
            if (b.country === 'Others') return -1;
            return b.averageWinningRate - a.averageWinningRate;
          })
          .slice(0, 20);

        setAverageByCountry(averageData);
      })
      .catch(error => console.error('API取得エラー:', error));
  }, []);

  const chartData = {
    labels: averageByCountry.map(item => item.country),
    datasets: [
      {
        label: '国別平均勝率',
        data: averageByCountry.map(item => Number(item.averageWinningRate.toFixed(3))),
        backgroundColor: '#435d86ff',
        borderColor: '#435d86ff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: { padding: { top: 20, bottom: 20, left: 30, right: 30 } },
    scales: {
      y: {
        min: 0.6,
        max: 1,
        title: {
          display: true,
          text: '勝率',       // 縦軸ラベル
          font: { size: 14 },
        },
        ticks: {
          stepSize: 0.1,
          callback: function (this: any, tickValue: string | number) {
            const val = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `${(val * 100).toFixed(0)}%`;
          },
        },
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
            const item = averageByCountry[index];
            return `平均勝率: ${(item.averageWinningRate * 100).toFixed(1)}%, 人数: ${item.count}`;
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
