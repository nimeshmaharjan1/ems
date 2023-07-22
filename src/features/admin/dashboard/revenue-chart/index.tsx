import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { formatPrice } from '@/shared/utils/helper.util';

const RevenueChart: React.FC<{
  revenueData: {
    date: string;
    revenue: number;
  }[];
}> = ({ revenueData }) => {
  if (!revenueData) return null;
  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={revenueData} margin={{ left: 30, top: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={10} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US')} />
            <YAxis
              allowDataOverflow={true}
              tickFormatter={(amount) => {
                return formatPrice(amount);
              }}
            />
            <Tooltip
              formatter={(value: number) => `रू ${formatPrice(value)}`}
              wrapperClassName="!p-4"
              labelFormatter={(label) => new Date(label).toLocaleDateString('en-US')}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Label value="Date" offset={0} position="insideBottom" />
            {/* <Label value="Revenue" position="middle" /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
