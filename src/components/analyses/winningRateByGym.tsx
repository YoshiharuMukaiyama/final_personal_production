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
  trainsAt?: string;
  winningRate?: number;
};

export const WinningRateByGym = () => {
  const [averageByGym, setAverageByGym] = useState<
    { gym: string; averageWinningRate: number; count: number }[]
  >([]);

  useEffect(() => {
    axios
      .get('https://api.octagon-api.com/fighters')
      .then((response) => {
        const fightersArray = Object.values(response.data) as Fighter[];

        const stats = fightersArray.map((fighter) => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const gym = fighter.trainsAt?.trim() || 'Others';
          return {
            gym,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        const gymGroups: { [gym: string]: { totalRate: number; count: number } } = {};
        stats.forEach((fighter) => {
          const gym = fighter.gym || 'Others';
          if (!gymGroups[gym]) gymGroups[gym] = { totalRate: 0, count: 0 };
          gymGroups[gym].totalRate += fighter.winningRate ?? 0;
          gymGroups[gym].count += 1;
        });

        const averageData = Object.entries(gymGroups)
          .map(([gym, { totalRate, count }]) => ({
            gym,
            averageWinningRate: count > 0 ? totalRate / count : 0,
            count,
          }))
          .sort((a, b) => {
            if (a.gym === 'Others') return 1;
            if (b.gym === 'Others') return -1;
            return b.averageWinningRate - a.averageWinningRate;
          })
          .slice(0, 10);

        setAverageByGym(averageData);
      })
      .catch((error) => console.error('API取得エラー:', error));
  }, []);

  const chartData = {
    labels: averageByGym.map((item) => item.gym),
    datasets: [
      {
        label: '平均勝率',
        data: averageByGym.map((item) => Number(item.averageWinningRate.toFixed(3))),
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
          text: '勝率',      // 縦軸ラベル
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
            const item = averageByGym[index];
            return `平均勝率: ${(item.averageWinningRate * 100).toFixed(1)}%, 人数: ${item.count}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '80vw', height: '60vh', margin: '20px auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
