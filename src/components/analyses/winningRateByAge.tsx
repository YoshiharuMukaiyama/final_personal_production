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
  const [fightersStats, setFightersStats] = useState<Fighter[]>([]);
  const [averageByAge, setAverageByAge] = useState<{ age: string; averageWinningRate: number; count: number }[]>([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        const stats = fightersArray.map(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          return {
            wins: fighter.wins,
            losses: fighter.losses,
            age: fighter.age,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        setFightersStats(stats);

        // 年齢別平均勝率計算
        const ageGroups: { [age: string]: { totalRate: number; count: number } } = {};

        stats.forEach(fighter => {
          const age = fighter.age ?? '不明';
          if (!ageGroups[age]) {
            ageGroups[age] = { totalRate: 0, count: 0 };
          }
          ageGroups[age].totalRate += fighter.winningRate ?? 0;
          ageGroups[age].count += 1;
        });

        const averageData = Object.entries(ageGroups).map(([age, { totalRate, count }]) => ({
          age,
          averageWinningRate: count > 0 ? totalRate / count : 0,
          count
        })).sort((a, b) => {
          if (a.age === '不明') return 1; // 不明は最後に
          if (b.age === '不明') return -1;
          return Number(a.age) - Number(b.age);
        });

        setAverageByAge(averageData);
      })
      .catch(error => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // グラフ用データ作成
  const chartData = {
    labels: averageByAge.map(item => item.age),
    datasets: [
      {
        label: '年齢別平均勝率',
        data: averageByAge.map(item => Number(item.averageWinningRate.toFixed(3))),
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
        display: false,  // これで凡例を非表示にする
      },
    },
  };


  return (
    <div>
      <h2>年齢別平均勝率グラフ</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
