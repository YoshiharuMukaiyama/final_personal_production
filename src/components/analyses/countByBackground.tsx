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
  // バックグラウンドごとの人数と平均勝率を保存する状態
  const [countByBackgroundData, setCountByBackgroundData] = useState<
    { background: string; count: number; averageWinningRate: number }[]
  >([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        // バックグラウンド別の合計勝率・人数を集計するオブジェクト
        const statsByBackground: {
          [background: string]: { totalWinningRate: number; count: number };
        } = {};

        fightersArray.forEach(fighter => {
          const wins = Number(fighter.wins);
          const losses = Number(fighter.losses);
          const winningRate = wins + losses > 0 ? wins / (wins + losses) : 0;

          // fightingStyleの統一（必要に応じて置換追加可）
          let background = fighter.fightingStyle?.trim() || 'Others';

          background = background.replace(/^Wrestler$/i, 'Wrestling')
            .replace(/^Brazilian Jiu-Jitsu$/i, 'Jiu-Jitsu')
            .replace(/^Boxer$/i, 'Boxing')
            .replace(/^Kickboxer$/i, 'Kickboxing')
            .replace(/^Striker$/i, 'Striking')
            .replace(/^Brawler$/i, 'Brawl')
            .replace(/^Grappler$/i, 'Grappling');

          if (!statsByBackground[background]) {
            statsByBackground[background] = { totalWinningRate: 0, count: 0 };
          }
          statsByBackground[background].totalWinningRate += winningRate;
          statsByBackground[background].count += 1;
        });

        // 平均勝率を計算し、配列に変換
        const countArray = Object.entries(statsByBackground)
          .map(([background, { totalWinningRate, count }]) => ({
            background,
            count,
            averageWinningRate: count > 0 ? totalWinningRate / count : 0,
          }))
          .sort((a, b) => {
            if (a.background === 'Others') return 1;
            if (b.background === 'Others') return -1;
            // 平均勝率の降順でソート
            return b.averageWinningRate - a.averageWinningRate;
          });

        setCountByBackgroundData(countArray);
      })
      .catch(error => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // 最大人数（Y軸max設定用）
  const maxCount = countByBackgroundData.length > 0 ? Math.max(...countByBackgroundData.map(item => item.count)) : 10;

  // グラフ用データ作成（人数を棒グラフで表示）
  const chartData = {
    labels: countByBackgroundData.map(item => item.background),
    datasets: [
      {
        label: '人数',
        data: countByBackgroundData.map(item => item.count),
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
            const item = countByBackgroundData[index];
            return `人数: ${item.count}, 平均勝率: ${(item.averageWinningRate * 100).toFixed(1)}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>バックボーン別人数グラフ</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
