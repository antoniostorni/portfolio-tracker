import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ChartView from '../components/ChartView';
import HoldingsTable from '../components/HoldingsTable';
import {
  fetchPortfolioChart,
  fetchPortfolioHoldings
} from '../api/portfolioApi';

// Hardcoded asset types, could be fetched from an API in a real app
const ASSET_TYPES = [
  'All', 
  'stock',
  'bonds',
  'crypto',
  'nft',
  'defi',
  'real_estate'
];

function PortfolioTracker() {
  const [userId, setUserId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assetType, setAssetType] = useState('All');

  const [chartData, setChartData] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [holdings, setHoldings] = useState([]);

  // Fetch data when selectedUserId or assetType changes
  useEffect(() => {
    if (!selectedUserId) {
      setChartData([]);
      setTotalValue(0);
      setHoldings([]);
      return;
    }

    // 1) Chart data
    fetchPortfolioChart(selectedUserId)
      .then(data => {
        setTotalValue(data.total_value || 0);
        if (data.chart) {
          const arr = Object.entries(data.chart).map(([name, value]) => ({
            name,
            value
          }));
          setChartData(arr);
        } else {
          setChartData([]);
        }
      })
      .catch(err => {
        console.error('Error fetching chart data:', err);
        setChartData([]);
        setTotalValue(0);
      });

    // 2) Holdings
    fetchPortfolioHoldings(selectedUserId, assetType)
      .then(data => {
        setHoldings(data);
      })
      .catch(err => {
        console.error('Error fetching holdings:', err);
        setHoldings([]);
      });
  }, [selectedUserId, assetType]);

  const handleSearch = () => {
    // Trigger the user ID to update
    setSelectedUserId(userId.trim());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">AssetDash Portfolio Tracker</h1>
        
        {/* SearchBar moved to the right */}
        <SearchBar
          userId={userId}
          onChange={(val) => setUserId(val)}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex gap-8">
        {/* Left: Chart */}
        <div className="w-80">
          <h2 className="text-xl font-semibold mb-2">Portfolio Chart</h2>
          <ChartView data={chartData} totalValue={totalValue} />
        </div>

        {/* Right: Holdings */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Portfolio Holdings</h2>
            <div className="flex items-center gap-2">
              <label htmlFor="assetType" className="font-medium">Asset type:</label>
              <select
                id="assetType"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <HoldingsTable holdings={holdings} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioTracker;
