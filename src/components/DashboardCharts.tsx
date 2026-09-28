import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts";
import type { Order } from "../types";

interface DashboardChartsProps {
  orders: Order[];
}

const PRIMARY_COLOR = "#2563EB";
const GRID_COLOR = "#E2E8F0";
const AXIS_LABEL_COLOR = "#64748B";
const STATUS_COLORS: Record<string, string> = {
  Processing: "#F59E0B",
  Shipped: "#2563EB",
  Delivered: "#16A34A",
  Cancelled: "#DC2626",
};

export default function DashboardCharts({ orders }: DashboardChartsProps) {
  const salesByDate = Object.entries(
    orders.reduce<Record<string, number>>((acc, order) => {
      const day = new Date(order.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] ?? 0) + order.total;
      return acc;
    }, {}),
  ).map(([date, Sales]) => ({ date, Sales: Number(Sales.toFixed(2)) }));

  const statusCounts = Object.entries(
    orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-md border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-medium text-gray-900">Sales Over Time</h3>
        <div className="mt-4 h-64">
          {salesByDate.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">
              No orders yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: AXIS_LABEL_COLOR }}
                  axisLine={{ stroke: GRID_COLOR }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: AXIS_LABEL_COLOR }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{ borderRadius: 6, borderColor: GRID_COLOR, fontSize: 14 }}
                />
                <Bar dataKey="Sales" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-6">
        <h3 className="text-sm font-medium text-gray-900">Orders by Status</h3>
        <div className="mt-4 h-64">
          {statusCounts.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-gray-400">
              No orders yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusCounts.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={STATUS_COLORS[entry.name] ?? "#94A3B8"}
                    />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: AXIS_LABEL_COLOR }} />
                <Tooltip
                  contentStyle={{ borderRadius: 6, borderColor: GRID_COLOR, fontSize: 14 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
