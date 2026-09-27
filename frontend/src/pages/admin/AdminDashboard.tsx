import { useState, useEffect, useMemo } from 'react';
import apiRequest from '../../utils/api';
import { generateDashboardReport } from '../../utils/dashboardPdf';
import {
  DashboardHeader,
  DashboardFilters,
  StatCardsGroup,
  FacultyChart,
  JobDistributionChart,
} from '../../components/admin/dashboard';

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

  // Faculty Concentration Data
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

  const isFiltered = yearFilter !== 'all' || termFilter !== 'all' || jobTypeFilter !== 'all';

  const resetFilters = () => {
    setYearFilter('all');
    setTermFilter('all');
    setJobTypeFilter('all');
  };

  const handleExportPDF = () => {
    generateDashboardReport({
      filteredJobsCount: filteredJobs.length,
      filteredAppsCount: filteredApps.length,
      approvedCount,
      totalPay,
      yearFilter,
      termFilter,
      jobTypeFilter,
      facultyData,
      pieData,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & PDF Export Action */}
      <DashboardHeader onExportPDF={handleExportPDF} />

      {/* 2. Glassmorphic Filter Controls */}
      <DashboardFilters
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        termFilter={termFilter}
        setTermFilter={setTermFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      {/* 3. Stat Cards Row */}
      {loading ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center text-slate-500 font-bold animate-pulse">
          Fetching live metrics...
        </div>
      ) : (
        <>
          <StatCardsGroup
            activeJobsCount={filteredJobs.length}
            applicantsCount={filteredApps.length}
            approvedCount={approvedCount}
            totalBudget={totalPay}
          />

          {/* 4. Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FacultyChart data={facultyData} />
            <JobDistributionChart data={pieData} totalJobs={filteredJobs.length} />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
