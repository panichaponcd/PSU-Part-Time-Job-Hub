import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import apiRequest from '../../utils/api';
import { Button } from '../../components/ui';

const PSU_BLUE = '#1a3a6b';
const LIGHT_BLUE = '#3b82f6';
const PIE_COLORS = [PSU_BLUE, LIGHT_BLUE];

function NoDataPlaceholder({ message = 'No Data Available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[180px]">
      <div className="text-3xl mb-2">📊</div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{message}</p>
      <p className="text-[9px] text-slate-400 mt-1 font-semibold">Try adjusting your filters</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white/60 rounded-xl p-5 flex items-center gap-4 border border-white/40 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-tight tracking-tight">{value}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
        {sub && <p className="text-[9px] text-psu-blue mt-0.5 font-semibold">{sub}</p>}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [yearFilter, setYearFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        apiRequest('/jobs/'),
        apiRequest('/applications/'),
      ]);
      const jobsData = await jobsRes.json();
      const appsData = await appsRes.json();

      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.results || []);
      setApplications(Array.isArray(appsData) ? appsData : appsData.results || []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch Error:', error);
      setLoading(false);
    }
  };

  const enrichedApps = applications.map((app) => ({
    ...app,
    jobDetails: jobs.find((j) => j.id === app.job),
  }));

  const filteredJobs = jobs.filter(
    (j) =>
      (yearFilter === 'all' || String(j.academic_year) === yearFilter) &&
      (termFilter === 'all' || String(j.academic_term) === termFilter) &&
      (jobTypeFilter === 'all' || j.job_type === jobTypeFilter.toUpperCase())
  );

  const filteredApps = enrichedApps.filter(
    (a) =>
      a.jobDetails &&
      (yearFilter === 'all' || String(a.jobDetails.academic_year) === yearFilter) &&
      (termFilter === 'all' || String(a.jobDetails.academic_term) === termFilter) &&
      (jobTypeFilter === 'all' || a.jobDetails.job_type === jobTypeFilter.toUpperCase())
  );

  const totalPay = filteredJobs.reduce(
    (sum, j) => sum + parseFloat(j.compensation_amount || 0),
    0
  );
  const approvedCount = filteredApps.filter((a) => a.status === 'APPROVED').length;

  const facultyData = [
    { name: 'FHT', count: filteredApps.filter((a) => a.faculty?.includes('Tourism')).length },
    {
      name: 'FIS',
      count: filteredApps.filter((a) => a.faculty?.includes('International')).length,
    },
    {
      name: 'FTE',
      count: filteredApps.filter((a) => a.faculty?.includes('Environment')).length,
    },
    {
      name: 'CoC',
      count: filteredApps.filter((a) => a.faculty?.includes('Computing')).length,
    },
  ].filter((f) => f.count > 0);

  const pieData = [
    { name: 'Internal', value: filteredJobs.filter((j) => j.job_type === 'INTERNAL').length },
    { name: 'External', value: filteredJobs.filter((j) => j.job_type === 'EXTERNAL').length },
  ].filter((p) => p.value > 0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('PSU Part-Time Job Hub Summary Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Metric', 'Value']],
      body: [
        ['Total Job Postings', filteredJobs.length],
        ['Total Applications', filteredApps.length],
        ['Approved Workers', approvedCount],
        ['Total Budget Allocated', `฿${totalPay.toLocaleString()}`],
      ],
    });
    doc.save('PSU_Job_Hub_Report.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">Overview of job placements & metrics</p>
        </div>
        <Button variant="primary" onClick={exportPDF}>
          📄 Export PDF Summary
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
        >
          <option value="all">All Academic Years</option>
          <option value="2024">Year 2024</option>
          <option value="2025">Year 2025</option>
          <option value="2026">Year 2026</option>
        </select>

        <select
          value={termFilter}
          onChange={(e) => setTermFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
        >
          <option value="all">All Terms</option>
          <option value="1">Term 1</option>
          <option value="2">Term 2</option>
          <option value="3">Term 3</option>
        </select>

        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
        >
          <option value="all">All Types</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
        </select>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-medium">Loading statistics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="💼" label="Active Listings" value={filteredJobs.length} />
            <StatCard icon="📄" label="Total Applicants" value={filteredApps.length} />
            <StatCard icon="✅" label="Approved Placements" value={approvedCount} />
            <StatCard
              icon="💰"
              label="Total Budget"
              value={`฿${totalPay.toLocaleString()}`}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Applications by Faculty
              </h3>
              {facultyData.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={facultyData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill={PSU_BLUE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                Job Distribution (Internal vs External)
              </h3>
              {pieData.length === 0 ? (
                <NoDataPlaceholder />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
