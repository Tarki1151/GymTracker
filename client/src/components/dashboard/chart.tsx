import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the chart
// In a real application, this would come from API call
const generateMembershipData = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const baseValue = 350;
  const growthRate = 0.05; // 5% growth each month
  
  return months.map((month, index) => {
    const value = Math.round(baseValue * Math.pow(1 + growthRate, index));
    return {
      name: month,
      members: value,
    };
  });
};

export default function MembershipChart() {
  const [data] = useState(generateMembershipData());

  return (
    <div className="h-64 bg-white rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="members"
            stroke="#4f46e5"
            fill="url(#colorMembers)"
            strokeWidth={2}
          />
          <defs>
            <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
