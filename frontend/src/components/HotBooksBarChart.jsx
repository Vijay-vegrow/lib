import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function GlassBox({ children, style }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.18)',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2rem',
        margin: '1.5rem 0',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.25)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(34,197,94,0.95)',
          color: '#fff',
          borderRadius: 10,
          padding: '1rem 1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>{label}</p>
        <p style={{ color: '#fff', margin: '6px 0 0 0', fontSize: 14 }}>
          Borrows: <span style={{ marginLeft: 8 }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function HotBooksBarChart({ data }) {
  return (
    <GlassBox>
      <h4 style={{ marginBottom: 16, color: '#234c2e' }}>Hot Books</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="title" tick={{ fill: '#166534', fontWeight: 500 }} />
          <YAxis tick={{ fill: '#166534', fontWeight: 500 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="borrow_count"
            fill="#22c55e"
            radius={[8, 8, 0, 0]}
            animationDuration={900}
            name="Borrows"
          />
        </BarChart>
      </ResponsiveContainer>
    </GlassBox>
  );
}