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
  fightingStyle?: string;
  wins: string;
  losses: string;
  winningRate?: number;
};

export const CountByBackground = () => {
  const [countByBackgroundData, setCountByBackgroundData] = useState<
    { background: string; count: number; averageWinningRate: number }[]
  >([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        const statsByBackground: { [background: string]: { totalWinningRate: number; count: number } } = {};

        fightersArray.forEach(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const winningRate = wins + losses > 0 ? wins / (wins + losses) : 0;

          let background = fighter.fightingStyle?.trim() || 'Others';
          background = background.replace(/^Wrestler$/i, 'Wrestling')
            .replace(/^Brazilian Jiu-Jitsu$/i, 'Jiu-Jitsu')
            .replace(/^Boxer$/i, 'Boxing')
            .replace(/^Kickboxer$/i, 'Kickboxing')
            .replace(/^Striker$/i, 'Striking')
            .replace(/^Brawler$/i, 'Brawl')
            .replace(/^Grappler$/i, 'Grappling');

          if (!statsByBackground[background]) statsByBackground[background] = { totalWinningRate: 0, count: 0 };

          statsByBackground[background].totalWinningRate += winningRate;
          statsByBackground[background].count += 1;
        });

        const countArray = Object.entries(statsByBackground)
          .map(([background, { totalWinningRate, count }]) => ({
            background,
            count,
            averageWinningRate: count > 0 ? totalWinningRate / count : 0,
          }))
          .sort((a, b) => {
            if (a.background === 'Others') return 1;
            if (b.background === 'Others') return -1;
            return b.averageWinningRate - a.averageWinningRate;
          });

        setCountByBackgroundData(countArray);
      })
      .catch(error => console.error(error));
  }, []);

  const maxCount = countByBackgroundData.length > 0
    ? Math.max(...countByBackgroundData.map(item => item.count))
    : 10;

  const chartData = {
    labels: countByBackgroundData.map(item => item.background),
    datasets: [
      {
        label: '人数',
        data: countByBackgroundData.map(item => item.count),
        backgroundColor: '#435d86ff', // 固定色
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
            const item = countByBackgroundData[index];
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
