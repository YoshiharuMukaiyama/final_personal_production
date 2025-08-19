import React, { useState } from 'react';

import {
  WinningRateByAge,
  CountByAge,
  WinningRateByBackground,
  CountByBackground,
  WinningRateByCountry,
  CountByCountry,
  WinningRateByGym,
  CountByGym
} from './analyses';

export function Analysis() {
  const [selectedAxes, setSelectedAxes] = useState({
    vertical: '1',
    horizontal: '1'
  });

  const handleChange = (axis: 'vertical' | 'horizontal') => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAxes(prev => ({
      ...prev,
      [axis]: e.target.value,
    }));
  };

  const componentMap: { [key: string]: React.ReactNode } = {
    '1-1': <WinningRateByAge />,
    '2-1': <CountByAge />,
    '1-2': <WinningRateByBackground />,
    '2-2': <CountByBackground />,
    '1-3': <WinningRateByCountry />,
    '2-3': <CountByCountry />,
    '1-4': <WinningRateByGym />,
    '2-4': <CountByGym />,
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 選択パネル */}
      <div style={panelStyle}>
        {/* 横軸を先に表示 */}
        <div style={axisControlStyle}>
          <label style={labelStyle}>x軸</label>
          <select
            value={selectedAxes.horizontal}
            onChange={handleChange('horizontal')}
            style={selectStyle}
          >
            <option value="1">年齢</option>
            <option value="2">バックボーン</option>
            <option value="3">出身国</option>
            <option value="4">所属ジム</option>
          </select>
        </div>

        {/* 縦軸を後に表示 */}
        <div style={axisControlStyle}>
          <label style={labelStyle}>y軸</label>
          <select
            value={selectedAxes.vertical}
            onChange={handleChange('vertical')}
            style={selectStyle}
          >
            <option value="1">勝率</option>
            <option value="2">人数</option>
          </select>
        </div>
      </div>

      {/* グラフ表示部分 */}
      <div style={{ marginTop: '30px' }}>
        {componentMap[`${selectedAxes.vertical}-${selectedAxes.horizontal}`] || null}
      </div>
    </div>
  );
}

// --- スタイル ---
const panelStyle: React.CSSProperties = {
  display: 'flex',
  gap: '40px',
  backgroundColor: '#374151', // ダークグレーで見やすく
  padding: '15px 20px',
  // borderRadius: '12px', ← 削除
  color: '#fff',
  alignItems: 'center',
};

const axisControlStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  paddingLeft: '14px',
  fontWeight: 600,
  textAlign: "left",
};

const selectStyle: React.CSSProperties = {
  padding: '8px',
  // borderRadius: '6px', ← 削除
  border: '1px solid #ccc',
  width: '120px', // 幅を固定
};
