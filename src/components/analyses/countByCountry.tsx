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

export const CountByCountry = () => {
  // 国別の人数と平均勝率を保存する状態
  const [countByCountryData, setCountByCountryData] = useState<
    { country: string; count: number; averageWinningRate: number }[]
  >([]);

  // placeOfBirthから国名を抽出（カンマで区切って最後の部分を国名と想定）
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

        // 国別の合計勝率・人数を集計するオブジェクト
        const statsByCountry: {
          [country: string]: { totalWinningRate: number; count: number };
        } = {};

        fightersArray.forEach(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const winningRate = wins + losses > 0 ? wins / (wins + losses) : 0;

          const country = extractCountry(fighter.placeOfBirth || '');

          if (!statsByCountry[country]) {
            statsByCountry[country] = { totalWinningRate: 0, count: 0 };
          }
          statsByCountry[country].totalWinningRate += winningRate;
          statsByCountry[country].count += 1;
        });

        // 平均勝率を計算し、配列に変換
        const countArray = Object.entries(statsByCountry)
          .map(([country, { totalWinningRate, count }]) => ({
            country,
            count,
            averageWinningRate: count > 0 ? totalWinningRate / count : 0,
          }))
          .sort((a, b) => {
            if (a.country === 'Others') return 1;
            if (b.country === 'Others') return -1;
            // 平均勝率の降順でソート
            return b.averageWinningRate - a.averageWinningRate;
          }).slice(0, 20);

        setCountByCountryData(countArray);
      })
      .catch(error => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // 最大人数（Y軸max設定用）
  const maxCount = countByCountryData.length > 0 ? Math.max(...countByCountryData.map(item => item.count)) : 10;

  // グラフ用データ作成（人数を棒グラフで表示）
  const chartData = {
    labels: countByCountryData.map(item => item.country),
    datasets: [
      {
        label: '人数',
        data: countByCountryData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // オプション設定（人数に合わせてY軸を調整）
  const options = {
    scales: {
      y: {
        min: 0,
        max: maxCount + 5, // 少し余裕をもたせる
        ticks: {
          stepSize: 5,
          callback: function (this: any, tickValue: string | number) {
            return tickValue;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            const item = countByCountryData[index];
            return `人数: ${item.count}, 平均勝率: ${(item.averageWinningRate * 100).toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>国別人数グラフ</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
