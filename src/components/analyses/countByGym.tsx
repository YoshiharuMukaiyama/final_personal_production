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
  trainsAt?: string; // 所属ジム
};

export const CountByGym = () => {
  const [gymCounts, setGymCounts] = useState<{ gym: string; count: number }[]>([]);

  useEffect(() => {
    axios
      .get('https://api.octagon-api.com/fighters')
      .then((response) => {
        const fightersArray = Object.values(response.data) as Fighter[];

        const gymGroups: { [gym: string]: number } = {};

        fightersArray.forEach((fighter) => {
          const gym = fighter.trainsAt?.trim() || 'Others';
          gymGroups[gym] = (gymGroups[gym] || 0) + 1;
        });

        const sorted = Object.entries(gymGroups)
          .map(([gym, count]) => ({ gym, count }))
          .sort((a, b) => {
            if (a.gym === 'Others') return 1;
            if (b.gym === 'Others') return -1;
            return b.count - a.count;
          })
          .slice(0, 10);

        setGymCounts(sorted);
      })
      .catch((error) => console.error('API取得エラー:', error));
  }, []);

  const maxCount = gymCounts.length > 0 ? Math.max(...gymCounts.map(item => item.count)) : 5;

  const chartData = {
    labels: gymCounts.map((item) => item.gym),
    datasets: [
      {
        label: '人数',
        data: gymCounts.map((item) => item.count),
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
        min: 0,
        max: maxCount + 2,
        title: {
          display: true,
          text: '人数', // 縦軸ラベル
          font: { size: 14 },
        },
        ticks: { stepSize: 1 },
      },
      x: {
        title: {
          display: true,
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: { display: false },
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
