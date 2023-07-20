import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // Fetch revenue data from your API endpoint
    axios.get('/api/admin/revenue').then((response) => {
      setRevenueData(response.data.revenueData);
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={revenueData} margin={{ left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US')} />
        <YAxis allowDataOverflow={true} />
        <Tooltip wrapperClassName="!p-4" labelFormatter={(label) => new Date(label).toLocaleDateString('en-US')} />
        <Legend />
        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Label value="Date" offset={0} position="insideBottom" />
        <Label value="Revenue" angle={-90} position="insideLeft" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
