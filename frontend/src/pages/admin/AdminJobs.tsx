import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/api';
import {
  JobManagementHeader,
  JobManagementFilters,
  JobsTable,
  JobCardList,
  JobsPagination,
  JobDeleteModal,
} from '../../components/admin/jobs';

function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Deletion Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiRequest('/jobs/');
      const data = await response.json();

      const sortedData = data.sort((a: any, b: any) => {
        if (b.academic_year !== a.academic_year) {
          return (b.academic_year || 0) - (a.academic_year || 0);
        }
        if (b.academic_term !== a.academic_term) {
          return (b.academic_term || 0) - (a.academic_term || 0);
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });

      setJobs(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const response = await apiRequest(`/jobs/${deleteConfirmId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== deleteConfirmId));
        setDeleteConfirmId(null);
      }
    } catch (error) {
      console.error('Error in soft-delete:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Unique Years for dropdown
  const uniqueYears = useMemo(() => {
    const years = jobs
      .map((job) => Number(job.academic_year))
      .filter((y) => Boolean(y) && !isNaN(y));
    return [...new Set(years)].sort((a, b) => b - a);
  }, [jobs]);

  // Filtered List
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.organization_name && job.organization_name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter.toUpperCase();
      const matchesType = typeFilter === 'all' || job.job_type === typeFilter.toUpperCase();
      const matchesYear = yearFilter === 'all' || String(job.academic_year) === yearFilter;
      const matchesTerm = termFilter === 'all' || String(job.academic_term) === termFilter;

      return matchesSearch && matchesStatus && matchesType && matchesYear && matchesTerm;
    });
  }, [jobs, search, statusFilter, typeFilter, yearFilter, termFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, yearFilter, termFilter, pageSize]);

  // Paginated List
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const isFiltered =
    Boolean(search) ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    yearFilter !== 'all' ||
    termFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setYearFilter('all');
    setTermFilter('all');
  };

  const selectedJobToDelete = jobs.find((j) => j.id === deleteConfirmId);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <JobManagementHeader />

      {/* 2. Search & Filters Bar */}
      <JobManagementFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        termFilter={termFilter}
        setTermFilter={setTermFilter}
        uniqueYears={uniqueYears}
        onReset={resetFilters}
        isFiltered={isFiltered}
      />

      {/* 3. Job Listings Display */}
      {loading ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-16 text-center text-slate-500 font-bold animate-pulse">
          Fetching job postings...
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-16 text-center border border-white/60 dark:border-slate-800 shadow-md">
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No matching job listings found
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Try adjusting your search query or filters
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <JobsTable
            jobs={paginatedJobs}
            onViewApplicants={(id) => navigate(`/admin/jobs/${id}/applicants`)}
            onEdit={(id) => navigate(`/admin/jobs/${id}/edit`)}
            onDelete={(id) => setDeleteConfirmId(id)}
          />

          {/* Mobile Card List View */}
          <JobCardList
            jobs={paginatedJobs}
            onViewApplicants={(id) => navigate(`/admin/jobs/${id}/applicants`)}
            onEdit={(id) => navigate(`/admin/jobs/${id}/edit`)}
            onDelete={(id) => setDeleteConfirmId(id)}
          />

          {/* 4. Pagination */}
          <JobsPagination
            currentPage={currentPage}
            totalItems={filteredJobs.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* 5. Soft Delete Confirmation Modal */}
      <JobDeleteModal
        jobId={deleteConfirmId}
        jobTitle={selectedJobToDelete?.title}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default AdminJobs;
