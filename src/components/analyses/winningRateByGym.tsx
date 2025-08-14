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
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        const stats = fightersArray.map((fighter) => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);

          // 所属ジム名（空なら Others）
          const gym = fighter.trainsAt?.trim() || 'Others';

          return {
            wins: fighter.wins,
            losses: fighter.losses,
            gym,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        // ジム別平均勝率計算
        const gymGroups: { [gym: string]: { totalRate: number; count: number } } = {};

        stats.forEach((fighter) => {
          const gym = fighter.gym || 'Others';
          if (!gymGroups[gym]) {
            gymGroups[gym] = { totalRate: 0, count: 0 };
          }
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
            // "Others" を常に最後に回す
            if (a.gym === 'Others') return 1;
            if (b.gym === 'Others') return -1;
            // それ以外は勝率降順
            return b.averageWinningRate - a.averageWinningRate;
          })
          .slice(0, 10);

        setAverageByGym(averageData);
      })
      .catch((error) => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // グラフ用データ
  const chartData = {
    labels: averageByGym.map((item) => item.gym),
    datasets: [
      {
        label: 'Win rate by gym', // 英語に変更
        data: averageByGym.map((item) => Number(item.averageWinningRate.toFixed(3))),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0.6,
        max: 1,
        ticks: {
          stepSize: 0.1,
          callback: function (this: any, tickValue: string | number) {
            const val = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `${(val * 100).toFixed(0)}%`;
          },
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
      <h2>ジム別平均勝率</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
