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

export const WinningRateByCountry = () => {
  const [averageByCountry, setAverageByCountry] = useState<{ country: string; averageWinningRate: number; count: number }[]>([]);

  // 国名抽出ヘルパー関数
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

        const stats = fightersArray.map(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);

          // 出身地から国名抽出
          const country = extractCountry(fighter.placeOfBirth || '');

          return {
            wins: fighter.wins,
            losses: fighter.losses,
            country,
            winningRate: wins + losses > 0 ? wins / (wins + losses) : 0,
          };
        });

        // 国別平均勝率計算
        const countryGroups: { [country: string]: { totalRate: number; count: number } } = {};

        stats.forEach(fighter => {
          const country = fighter.country || 'Others';
          if (!countryGroups[country]) {
            countryGroups[country] = { totalRate: 0, count: 0 };
          }
          countryGroups[country].totalRate += fighter.winningRate ?? 0;
          countryGroups[country].count += 1;
        });

        const averageData = Object.entries(countryGroups).map(([country, { totalRate, count }]) => ({
          country,
          averageWinningRate: count > 0 ? totalRate / count : 0,
          count,
        })).sort((a, b) => {
          if (a.country === 'Others') return 1;
          if (b.country === 'Others') return -1;
          return b.averageWinningRate - a.averageWinningRate; // 降順
        }).slice(0, 20);

        setAverageByCountry(averageData);
      })
      .catch(error => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // グラフ用データ作成
  const chartData = {
    labels: averageByCountry.map(item => item.country),
    datasets: [
      {
        label: '国別平均勝率',
        data: averageByCountry.map(item => Number(item.averageWinningRate.toFixed(3))),
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
      <h2>国別平均勝率グラフ</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
