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

// Chart.js コンポーネント登録
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Fighter = {
  wins: string;
  losses: string;
  age?: string;
  winningRate?: number;
};

export const WinningRateByAge = () => {
  const [averageByAge, setAverageByAge] = useState<{ age: string; averageWinningRate: number; count: number }[]>([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const fightersArray = Object.values(response.data) as Fighter[];

        const stats = fightersArray.map(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          return {
            age: fighter.age,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        const ageGroups: { [age: string]: { totalRate: number; count: number } } = {};

        stats.forEach(fighter => {
          const age = fighter.age ?? '不明';
          if (!ageGroups[age]) ageGroups[age] = { totalRate: 0, count: 0 };
          ageGroups[age].totalRate += fighter.winningRate ?? 0;
          ageGroups[age].count += 1;
        });

        const averageData = Object.entries(ageGroups).map(([age, { totalRate, count }]) => ({
          age,
          averageWinningRate: count > 0 ? totalRate / count : 0,
          count
        })).sort((a, b) => {
          if (a.age === '不明') return 1;
          if (b.age === '不明') return -1;
          return Number(a.age) - Number(b.age);
        });

        setAverageByAge(averageData);
      })
      .catch(error => console.error('API取得エラー:', error));
  }, []);

  const chartData = {
    labels: averageByAge.map(item => item.age),
    datasets: [
      {
        label: '年齢別平均勝率',
        data: averageByAge.map(item => Number(item.averageWinningRate.toFixed(3))),
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
          text: '勝率', // 縦軸ラベル
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
          text: '年齢', // 横軸ラベル
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
            const item = averageByAge[index];
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
