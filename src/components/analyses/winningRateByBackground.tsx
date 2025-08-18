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
  fightingStyle?: string;  // バックグラウンド
  winningRate?: number;
};

export const WinningRateByBackground = () => {
  const [averageByBackground, setAverageByBackground] = useState<{ background: string; averageWinningRate: number; count: number }[]>([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const fightersArray = Object.values(response.data) as Fighter[];

        const stats = fightersArray.map(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);

          // fightingStyle の統一処理
          let style = fighter.fightingStyle?.trim() || 'Others';
          style = style.replace(/^Wrestler$/i, 'Wrestling')
            .replace(/^Brazilian Jiu-Jitsu$/i, 'Jiu-Jitsu')
            .replace(/^Boxer$/i, 'Boxing')
            .replace(/^Kickboxer$/i, 'Kickboxing')
            .replace(/^Striker$/i, 'Striking')
            .replace(/^Brawler$/i, 'Brawl')
            .replace(/^Grappler$/i, 'Grappling');

          return {
            fightingStyle: style,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        const backgroundGroups: { [background: string]: { totalRate: number; count: number } } = {};
        stats.forEach(fighter => {
          const background = fighter.fightingStyle || 'Others';
          if (!backgroundGroups[background]) backgroundGroups[background] = { totalRate: 0, count: 0 };
          backgroundGroups[background].totalRate += fighter.winningRate ?? 0;
          backgroundGroups[background].count += 1;
        });

        const averageData = Object.entries(backgroundGroups)
          .map(([background, { totalRate, count }]) => ({
            background,
            averageWinningRate: count > 0 ? totalRate / count : 0,
            count
          }))
          .sort((a, b) => {
            if (a.background === 'Others') return 1;
            if (b.background === 'Others') return -1;
            return b.averageWinningRate - a.averageWinningRate;
          });

        setAverageByBackground(averageData);
      })
      .catch(error => console.error('API取得エラー:', error));
  }, []);

  const chartData = {
    labels: averageByBackground.map(item => item.background),
    datasets: [
      {
        label: 'バックグラウンド別平均勝率',
        data: averageByBackground.map(item => Number(item.averageWinningRate.toFixed(3))),
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
          text: '勝率',   // 縦軸ラベル
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
          text: 'バックボーン',
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
            const item = averageByBackground[index];
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
