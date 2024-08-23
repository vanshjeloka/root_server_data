import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import './Graph.css';

const Graph = React.memo(({ data, showTotal, selectedRoots }) => {
  const getLineColor = (root) => {
    const colors = {
      'A': '#8884d8',
      'B': '#82ca9d',
      'C': '#ffc658',
      'D': '#ff7300',
      'E': '#387908',
      'F': '#8a2be2',
      'G': '#5f9ea0',
      'H': '#d2691e',
      'I': '#ff6347',
      'J': '#f0e68c',
      'K': '#32cd32',
      'L': '#ffa07a',
      'M': '#c71585'
    };
    return colors[root] || '#000';
  };

  const years = useMemo(() => {
    return [...new Set(data.map(item => new Date(item.date).getFullYear()))].sort((a, b) => b - a);
  }, [data]);

  const totalData = useMemo(() => {
    if (!showTotal) return [];
    return years.map(year => {
      const yearData = { year };
      yearData['Total'] = data
        .filter(item => new Date(item.date).getFullYear() === year)
        .length;
      return yearData;
    });
  }, [data, showTotal, years]);

  const chartData = useMemo(() => {
    const baseData = years.map(year => {
      const yearData = { year };
      selectedRoots.forEach(root => {
        const count = data.filter(item => new Date(item.date).getFullYear() === year && item.root === root).length;
        yearData[root] = count;
      });
      return yearData;
    });

    if (showTotal) {
      baseData.forEach(yearData => {
        yearData['Total'] = data
          .filter(item => new Date(item.date).getFullYear() === yearData.year)
          .length;
      });
    }

    return baseData;
  }, [data, selectedRoots, showTotal, years]);

  const lines = useMemo(() => {
    const rootLines = selectedRoots.map(root => (
      <Line
        key={root}
        type="monotone"
        dataKey={root}
        stroke={getLineColor(root)}
        strokeWidth={2}
        dot={{ stroke: getLineColor(root), strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6 }}
        isAnimationActive={true}
      />
    ));

    if (showTotal) {
      rootLines.push(
        <Line
          key="Total"
          type="monotone"
          dataKey="Total"
          stroke="#000000"
          strokeWidth={2}
          dot={{ stroke: '#000000', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />
      );
    }

    return rootLines;
  }, [selectedRoots, showTotal, getLineColor]);

  return (
    <div className="graph-container">
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="year" reversed>
            <Label value="Year" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Servers Added" angle={-90} position="insideLeft" dy={-10} />
          </YAxis>
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            labelStyle={{ color: '#000' }}
          />
          <Legend verticalAlign="top" height={36} />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default Graph;
