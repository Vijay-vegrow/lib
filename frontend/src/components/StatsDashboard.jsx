import { useEffect, useState } from 'react';
import {
  fetchStatsSummary,
  fetchBorrowTrends,
  fetchHotBooks
} from '../api';
import HotBooksBarChart from './HotBooksBarChart';
import PieDonutChart from './PieDonutChart';
import BorrowingTrendsAreaChart from './BorrowingTrendsAreaChart';

const COLORS = ['#388e3c', '#ffa000', '#b71c1c', '#1976d2', '#c62828'];

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        padding: "1.25rem 1.5rem",
        margin: 12,
        minWidth: 160,
        textAlign: "center",
        color: color || "#234c2e",
        fontWeight: 600,
        fontSize: 18,
        border: "1px solid #e0e0e0",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ fontSize: 15, color: "#888", fontWeight: 400 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function UnifiedBox({ children, style }) {
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

export default function StatsDashboard() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [hotBooks, setHotBooks] = useState([]);

  useEffect(() => {
    fetchStatsSummary().then(setSummary);
    fetchBorrowTrends().then(setTrends);
    fetchHotBooks().then(setHotBooks);
  }, []);

  if (!summary) return <div>Loading stats...</div>;

  return (
    <>
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2 style={{ display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Library Statistics</h2>
      <div style={{ display: 'flex',  gap: 12 }}>
        <StatCard label="Total Books" value={summary.total_books} />
        <StatCard label="Total Borrowings" value={summary.total_borrowings} />
        <StatCard label="Active Borrowings" value={summary.active_borrowings} color="#ffa000" />
        <StatCard label="Pending Returns" value={summary.pending_returns} color="#1976d2" />
        <StatCard label="Active Members (30d)" value={summary.active_members} color="#388e3c" />
      </div>
    
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 32, gap: 32 }}>
        <UnifiedBox>
          <BorrowingTrendsAreaChart data={trends} />
        </UnifiedBox>
        <UnifiedBox style={{ flex: 1, minWidth: 250 }}>
          <PieDonutChart
            data={[
              { name: 'Available', value: summary.total_books - summary.active_borrowings, fill: '#388e3c' },
              { name: 'Borrowed', value: summary.active_borrowings, fill: '#ffa000' }
            ]}
            title="Book Status"
            description="Current availability"
            centerLabel="Books"
            trending="Trending up by 2% this month"
            footer="Live library status"
          />
        </UnifiedBox>
      </div>

      <div style={{ marginTop: 32 }}>
        <HotBooksBarChart data={hotBooks} />
      </div>
    </div>
    </>
  );
}