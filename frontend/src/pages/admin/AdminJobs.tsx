import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from '../../utils/api';
import { Button, Badge, Modal } from '../../components/ui';

function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiRequest('/jobs/');
      const data = await response.json();

      const sortedData = data.sort((a: any, b: any) => {
        if (b.academic_year !== a.academic_year) {
          return b.academic_year - a.academic_year;
        }
        if (b.academic_term !== a.academic_term) {
          return b.academic_term - a.academic_term;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setJobs(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiRequest(`/jobs/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: false }),
      });

      if (response.ok) {
        setJobs(jobs.filter((j) => j.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error in soft-delete:', error);
    }
  };

  const uniqueYears = [...new Set(jobs.map((job) => job.academic_year))].sort((a, b) => b - a);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter.toUpperCase();
    const matchesType = typeFilter === 'all' || job.job_type === typeFilter.toUpperCase();
    const matchesYear = yearFilter === 'all' || job.academic_year === Number(yearFilter);
    const matchesTerm = termFilter === 'all' || job.academic_term === Number(termFilter);
    return matchesSearch && matchesStatus && matchesType && matchesYear && matchesTerm;
  });

  return (
    <div className="relative min-h-screen">
      <div className="relative z-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
              <p className="text-sm text-gray-500 font-medium">Create, edit, and organize job postings</p>
            </div>
            <Button variant="primary" onClick={() => navigate('/admin/jobs/new')}>
              + New Job Listing
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-psu-blue/50 flex-1 min-w-[200px]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
            >
              <option value="all">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-medium"
            >
              <option value="all">All Years</option>
              {uniqueYears.map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
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
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium">Loading job listings...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-medium bg-white/70 rounded-2xl border">
              No matching job listings found.
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Organization</th>
                    <th className="px-5 py-4">Term/Year</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Applicants</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-800">{job.title}</td>
                      <td className="px-5 py-4 text-gray-600">{job.organization_name}</td>
                      <td className="px-5 py-4 font-medium text-gray-600">
                        Term {job.academic_term}/{job.academic_year}
                      </td>
                      <td className="px-5 py-4 font-semibold text-psu-blue">{job.job_type}</td>
                      <td className="px-5 py-4 font-bold text-gray-700">
                        {job.applicants_count || 0}/{job.required_amount}
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={job.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/admin/jobs/${job.id}/applicants`)}
                          >
                            👥 Applicants
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteConfirm(job.id)}
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Soft Delete"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to deactivate this job listing? It will be hidden from the active list.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AdminJobs;
