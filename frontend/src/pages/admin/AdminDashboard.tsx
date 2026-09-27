import React, { useState, useEffect, useMemo, ReactNode } from 'react';
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
import {
  Briefcase,
  Users,
  CheckCircle2,
  Wallet,
  FileDown,
  RotateCcw,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
} from 'lucide-react';
import apiRequest from '../../utils/api';

const PSU_NAVY = '#0a2540';
const PSU_BLUE = '#006398';
const DONUT_COLORS = [PSU_NAVY, '#38bdf8'];

function NoDataPlaceholder({ message = 'No Data Available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
        <BarChart3 className="w-6 h-6" />
      </div>
      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
        {message}
      </p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
        Try adjusting your filter selection
      </p>
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  badgeText?: string;
  variant: 'blue' | 'sky' | 'emerald' | 'amber';
}

function StatCard({ icon, label, value, sub, badgeText, variant }: StatCardProps) {
  const variantStyles = {
    blue: {
      container: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/60 text-[#006398] dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-[#006398] dark:text-blue-200',
    },
    sky: {
      container: 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/60 text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    },
    emerald: {
      container: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      container: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/60 text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${currentVariant.container}`}
        >
          {icon}
        </div>
        {badgeText && (
          <span
            className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${currentVariant.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
          {value}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {sub}
          </p>
        )}
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

  const enrichedApps = useMemo(() => {
    return applications.map((app) => ({
      ...app,
      jobDetails: jobs.find((j) => j.id === app.job),
    }));
  }, [applications, jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (j) =>
        (yearFilter === 'all' || String(j.academic_year) === yearFilter) &&
        (termFilter === 'all' || String(j.academic_term) === termFilter) &&
        (jobTypeFilter === 'all' || j.job_type === jobTypeFilter.toUpperCase())
    );
  }, [jobs, yearFilter, termFilter, jobTypeFilter]);

  const filteredApps = useMemo(() => {
    return enrichedApps.filter(
      (a) =>
        a.jobDetails &&
        (yearFilter === 'all' || String(a.jobDetails.academic_year) === yearFilter) &&
        (termFilter === 'all' || String(a.jobDetails.academic_term) === termFilter) &&
        (jobTypeFilter === 'all' || a.jobDetails.job_type === jobTypeFilter.toUpperCase())
    );
  }, [enrichedApps, yearFilter, termFilter, jobTypeFilter]);

  const totalPay = useMemo(() => {
    return filteredJobs.reduce(
      (sum, j) => sum + parseFloat(j.compensation_amount || 0),
      0
    );
  }, [filteredJobs]);

  const approvedCount = useMemo(() => {
    return filteredApps.filter((a) => a.status === 'APPROVED').length;
  }, [filteredApps]);

  // Faculty Concentration
  const facultyData = useMemo(() => {
    const faculties = [
      { name: 'CoC', fullName: 'College of Computing', key: 'Computing' },
      { name: 'FHT', fullName: 'Faculty of Hospitality & Tourism', key: 'Tourism' },
      { name: 'FIS', fullName: 'Faculty of International Studies', key: 'International' },
      { name: 'FTE', fullName: 'Faculty of Technology & Environment', key: 'Environment' },
    ];

    return faculties.map((f) => ({
      name: f.name,
      fullName: f.fullName,
      count: filteredApps.filter((a) =>
        (a.faculty || '').toLowerCase().includes(f.key.toLowerCase())
      ).length,
    }));
  }, [filteredApps]);

  const hasFacultyData = facultyData.some((f) => f.count > 0);

  // Internal vs External Job Distribution
  const pieData = useMemo(() => {
    const internalCount = filteredJobs.filter((j) => j.job_type === 'INTERNAL').length;
    const externalCount = filteredJobs.filter((j) => j.job_type === 'EXTERNAL').length;
    const total = internalCount + externalCount;

    return [
      {
        name: 'Internal Positions',
        value: internalCount,
        percentage: total > 0 ? Math.round((internalCount / total) * 100) : 0,
      },
      {
        name: 'External Companies',
        value: externalCount,
        percentage: total > 0 ? Math.round((externalCount / total) * 100) : 0,
      },
    ];
  }, [filteredJobs]);

  const hasPieData = pieData.some((p) => p.value > 0);

  const isFiltered = yearFilter !== 'all' || termFilter !== 'all' || jobTypeFilter !== 'all';

  const resetFilters = () => {
    setYearFilter('all');
    setTermFilter('all');
    setJobTypeFilter('all');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const generatedDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // 1. Title Header
    doc.setFontSize(16);
    doc.setTextColor(10, 37, 64);
    doc.text('PRINCE OF SONGKLA UNIVERSITY, PHUKET CAMPUS', 14, 18);

    doc.setFontSize(12);
    doc.setTextColor(0, 99, 152);
    doc.text('Part-time Job Hub — Executive Analytics Summary Report', 14, 26);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${generatedDate}`, 14, 33);
    doc.text(
      `Filter Scope: Year: ${yearFilter === 'all' ? 'All' : yearFilter} | Term: ${
        termFilter === 'all' ? 'All' : termFilter
      } | Type: ${jobTypeFilter === 'all' ? 'All' : jobTypeFilter.toUpperCase()}`,
      14,
      38
    );

    // 2. Summary KPI Table
    autoTable(doc, {
      startY: 44,
      head: [['Key Metric Indicator', 'Value Recorded']],
      body: [
        ['Active Job Listings', filteredJobs.length.toString()],
        ['Total Student Applications', filteredApps.length.toString()],
        ['Approved Placements', approvedCount.toString()],
        ['Total Allocated Budget', `THB ${totalPay.toLocaleString()}`],
      ],
      headStyles: {
        fillColor: [10, 37, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      theme: 'grid',
    });

    // 3. Faculty Distribution Table
    const lastY1 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(10, 37, 64);
    doc.text('Applications Distribution by Faculty', 14, lastY1);

    autoTable(doc, {
      startY: lastY1 + 4,
      head: [['Faculty / College', 'Unit Code', 'Total Applicants']],
      body: facultyData.map((f) => [f.fullName, f.name, f.count.toString()]),
      headStyles: {
        fillColor: [0, 99, 152],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
      },
      theme: 'grid',
    });

    // 4. Job Type Breakdown Table
    const lastY2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(10, 37, 64);
    doc.text('Job Provider Distribution (Internal vs External)', 14, lastY2);

    autoTable(doc, {
      startY: lastY2 + 4,
      head: [['Provider Type', 'Listings Count', 'Proportion']],
      body: pieData.map((p) => [p.name, p.value.toString(), `${p.percentage}%`]),
      headStyles: {
        fillColor: [10, 37, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3.5,
      },
      theme: 'grid',
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `PSU Phuket Job Hub — Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`PSU_Job_Hub_Analytics_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & PDF Export Action */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Analytics & Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Overview of student placements, faculty metrics, and allocated budget
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={exportPDF}
            className="inline-flex items-center gap-2 bg-psu-navy hover:bg-[#003c71] dark:bg-psu-blue dark:hover:bg-[#00527f] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <FileDown className="w-4 h-4 text-white" />
            <span>Export PDF Summary</span>
          </button>
        </div>
      </div>

      {/* 2. Glassmorphic Filter Controls */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-lg border border-white/60 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 select-none">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Academic Year */}
        <div className="relative flex-1 sm:flex-initial min-w-[170px]">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 shadow-2xs focus:outline-none focus:ring-2 focus:ring-psu-blue/30 cursor-pointer transition-all"
          >
            <option value="all">All Academic Years</option>
            <option value="2026">Academic Year 2026 (2569)</option>
            <option value="2025">Academic Year 2025 (2568)</option>
            <option value="2024">Academic Year 2024 (2567)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Academic Term */}
        <div className="relative flex-1 sm:flex-initial min-w-[140px]">
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 shadow-2xs focus:outline-none focus:ring-2 focus:ring-psu-blue/30 cursor-pointer transition-all"
          >
            <option value="all">All Terms</option>
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Summer Term</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Job Type */}
        <div className="relative flex-1 sm:flex-initial min-w-[170px]">
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 shadow-2xs focus:outline-none focus:ring-2 focus:ring-psu-blue/30 cursor-pointer transition-all"
          >
            <option value="all">All Job Types</option>
            <option value="internal">Internal (PSU Depts)</option>
            <option value="external">External (Industry Partners)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 3. Stat Cards Row */}
      {loading ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center text-slate-500 font-bold animate-pulse">
          Fetching live metrics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatCard
              icon={<Briefcase className="w-6 h-6" />}
              label="Active Listings"
              value={filteredJobs.length}
              sub="Available postings"
              variant="blue"
            />
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Applicants"
              value={filteredApps.length}
              sub="Student submissions"
              badgeText={filteredApps.length > 0 ? `${filteredApps.length} enrolled` : undefined}
              variant="sky"
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              label="Approved Placements"
              value={approvedCount}
              sub="Confirmed workers"
              badgeText={
                filteredApps.length > 0
                  ? `${Math.round((approvedCount / (filteredApps.length || 1)) * 100)}% rate`
                  : undefined
              }
              variant="emerald"
            />
            <StatCard
              icon={<Wallet className="w-6 h-6" />}
              label="Total Budget"
              value={`฿${totalPay.toLocaleString()}`}
              sub="Allocated compensation"
              badgeText="THB"
              variant="amber"
            />
          </div>

          {/* 4. Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Applications by Faculty */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-psu-blue" />
                  <span>Applications by Faculty</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  Candidate concentration by academic unit
                </p>
              </div>

              {!hasFacultyData ? (
                <NoDataPlaceholder message="No Faculty Data" />
              ) : (
                <div className="w-full pt-4">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={facultyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        fontWeight={500}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0, 99, 152, 0.05)' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white rounded-xl shadow-xl px-3.5 py-2.5 text-xs border border-slate-700">
                                <p className="font-bold text-blue-300">{data.fullName}</p>
                                <p className="text-slate-200 mt-0.5">
                                  Applicants:{' '}
                                  <span className="font-extrabold text-white">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#006398"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={48}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>CoC · FHT · FIS · FTE</span>
                <span className="font-semibold text-psu-blue">Live sync</span>
              </div>
            </div>

            {/* Chart 2: Job Distribution (Internal vs External) */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-psu-blue" />
                  <span>Job Distribution</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                  Internal university positions vs external partner listings
                </p>
              </div>

              {!hasPieData ? (
                <NoDataPlaceholder message="No Job Postings" />
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 flex-1">
                  {/* Donut graphic */}
                  <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white rounded-xl shadow-xl px-3 py-2 text-xs border border-slate-700">
                                  <p className="font-bold">{data.name}</p>
                                  <p className="text-slate-200 mt-0.5">
                                    {data.value} listings ({data.percentage}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Donut Center Count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                        {filteredJobs.length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                        Total Jobs
                      </span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#0a2540] dark:bg-blue-400 shrink-0 shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Internal Positions
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {pieData[0].percentage}% ({pieData[0].value} listings)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#38bdf8] shrink-0 shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          External Companies
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {pieData[1].percentage}% ({pieData[1].value} listings)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Campus & Corporate Partners</span>
                <span className="font-semibold text-psu-blue">Real-time stats</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
