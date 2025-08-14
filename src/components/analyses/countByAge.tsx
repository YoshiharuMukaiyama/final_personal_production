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
  age?: string;
  winningRate?: number;
};

export const CountByAge = () => {
  // 年齢ごとの人数を保存する状態
  const [countByAgeData, setCountByAgeData] = useState<{ age: string; count: number }[]>([]);

  useEffect(() => {
    axios.get('https://api.octagon-api.com/fighters')
      .then(response => {
        const dataObj = response.data;
        const fightersArray = Object.values(dataObj) as Fighter[];

        // 年齢別人数を格納するオブジェクトを作成
        const countByAge: { [age: string]: number } = {};

        fightersArray.forEach(fighter => {
          const age = fighter.age ?? '不明'; // 年齢がなければ '不明'
          if (!countByAge[age]) {
            countByAge[age] = 0;
          }
          countByAge[age] += 1;
        });

        // オブジェクトを配列に変換し、数値の昇順に並び替え（不明は最後）
        const countArray = Object.entries(countByAge)
          .map(([age, count]) => ({ age, count }))
          .sort((a, b) => {
            if (a.age === '不明') return 1;
            if (b.age === '不明') return -1;
            return Number(a.age) - Number(b.age);
          });

        setCountByAgeData(countArray);
      })
      .catch(error => {
        console.error('API取得エラー:', error);
      });
  }, []);

  // 最大人数（Y軸のmax設定用）
  const maxCount = countByAgeData.length > 0 ? Math.max(...countByAgeData.map(item => item.count)) : 10;

  // グラフ用データ作成
  const chartData = {
    labels: countByAgeData.map(item => item.age),
    datasets: [
      {
        label: '人数',
        data: countByAgeData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // オプション設定（人数に合わせてY軸を調整）
  const options = {
    scales: {
      y: {
        min: 0,
        max: maxCount + 5,  // 少し余裕をもたせる
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
    },
  };

  return (
    <div>
      <h2>年齢別人数グラフ</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};
