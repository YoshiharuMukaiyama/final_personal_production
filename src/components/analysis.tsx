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

  // 選択値に対応するコンポーネントマップ
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
    <div>
      <div>
        <label htmlFor="dropdown">縦軸: </label>
        <select id="dropdown" value={selectedAxes.vertical} onChange={handleChange('vertical')}>
          <option value="1">勝率</option>
          <option value="2">人数</option>
        </select>
      </div>

      <div>
        <label htmlFor="dropdown">横軸: </label>
        <select id="dropdown" value={selectedAxes.horizontal} onChange={handleChange('horizontal')}>
          <option value="1">年齢</option>
          <option value="2">バックボーン</option>
          <option value="3">出身国</option>
          <option value="4">所属ジム</option>
        </select>
      </div>

      <div>
        {componentMap[`${selectedAxes.vertical}-${selectedAxes.horizontal}`] || null}
      </div>
    </div>
  );
}
