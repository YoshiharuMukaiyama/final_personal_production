import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useFighters, Fighter } from "../hooks/useFighters";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const CountByAge = () => {
  const { fighters, loading, error } = useFighters();

  // 年齢ごとのカウントを計算
  const countByAgeData = useMemo(() => {
    const countByAge: { [age: string]: number } = {};

    fighters.forEach((fighter: Fighter) => {
      const age = fighter.age ?? "不明";
      countByAge[age] = (countByAge[age] ?? 0) + 1;
    });

    return Object.entries(countByAge)
      .map(([age, count]) => ({ age, count }))
      .sort((a, b) => {
        if (a.age === "不明") return 1;
        if (b.age === "不明") return -1;
        return Number(a.age) - Number(b.age);
      });
  }, [fighters]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const maxCount =
    countByAgeData.length > 0
      ? Math.max(...countByAgeData.map((item) => item.count))
      : 10;

  const chartData = {
    labels: countByAgeData.map((item) => item.age),
    datasets: [
      {
        label: "人数",
        data: countByAgeData.map((item) => item.count),
        backgroundColor: "#435d86ff",
        borderColor: "#435d86ff",
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
          text: "人数",
          font: { size: 14 },
        },
        ticks: { stepSize: 5 },
      },
      x: {
        title: {
          display: true,
          text: "年齢",
          font: { size: 14 },
        },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "90vw", height: "70vh", margin: "0 auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
