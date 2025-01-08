import React from 'react';

function HoldingsTable({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <p className="text-center text-gray-600 p-8 text-lg">
        No holdings found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-50">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Ticker</th>
            <th className="text-left p-3">Type</th>
            <th className="text-right p-3">Percentage (%)</th>
            <th className="text-right p-3">Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, idx) => (
            <tr 
              key={`${holding.ticker}-${idx}`}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="p-3">{holding.name}</td>
              <td className="p-3 text-blue-600">{holding.ticker}</td>
              <td className="p-3">{holding.type}</td>
              <td className="p-3 text-right">
                {Number(holding.percentage).toFixed(2)}%
              </td>
              <td className="p-3 text-right">
                ${Number(holding.value).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HoldingsTable;
