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
  const [gymCounts, setGymCounts] = useState<
    { gym: string; count: number }[]
  >([]);

  useEffect(() => {
    axios
      .get('https://api.octagon-api.com/fighters')
      .then((response) => {
        const fightersArray = Object.values(response.data) as Fighter[];

        // ジムごとの人数カウント
        const gymGroups: { [gym: string]: number } = {};

        fightersArray.forEach((fighter) => {
          const gym = fighter.trainsAt?.trim() || 'Others';
          gymGroups[gym] = (gymGroups[gym] || 0) + 1;
        });

        // 人数順に並び替え（上位10）
        const sorted = Object.entries(gymGroups)
          .map(([gym, count]) => ({ gym, count }))
          .sort((a, b) => {
            // "Others" を最後に
            if (a.gym === 'Others') return 1;
            if (b.gym === 'Others') return -1;
            return b.count - a.count; // 人数降順
          })
          .slice(0, 10);

        setGymCounts(sorted);
      })
      .catch((error) => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // グラフ用データ
  const chartData = {
    labels: gymCounts.map((item) => item.gym),
    datasets: [
      {
        label: 'Number of fighters by gym',
        data: gymCounts.map((item) => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h2>ジム別人数</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
