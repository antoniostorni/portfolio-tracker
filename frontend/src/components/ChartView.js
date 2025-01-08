import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

const COLORS = [
  '#8884D8', '#82CA9D', '#FFBB28',
  '#FF8042', '#0088FE', '#FF6666'
];

function ChartView({ data, totalValue }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No chart data to display.</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      {totalValue > 0 && (
        <p className="font-bold text-lg">
          ${Number(totalValue).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default ChartView;
