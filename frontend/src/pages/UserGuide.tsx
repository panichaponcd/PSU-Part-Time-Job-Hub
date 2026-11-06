import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  Copy,
  Check,
  User,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Star,
  PlusCircle,
  BarChart3,
  ExternalLink,
  Sparkles,
  Server,
  Database,
  Code2,
  FileText
} from 'lucide-react';
import { InfoPageContainer } from '../components/ui/InfoPageContainer';
import GlassCard from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export const UserGuide: FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <InfoPageContainer
      title="System User Guide & Evaluation Manual"
      subtitle="Interactive Testing Walkthrough for Project Advisor & Stakeholders"
      categoryTag="Demonstration & Evaluation"
      maxWidth="max-w-5xl"
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-psu-blue/5 dark:bg-psu-light/5 border border-psu-blue/15 dark:border-psu-light/15">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-psu-blue dark:text-psu-light" />
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
            Digital Engineering Final Project II • PSU Phuket
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-psu-blue" />
            FastAPI Swagger Docs
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* SECTION 1: Test Credentials */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-psu-navy dark:text-white">
              Pre-seeded Evaluation Accounts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Use these pre-configured test credentials to sign in and test the student and administrative workflows.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Card */}
          <GlassCard variant="card" className="p-5 border-l-4 border-l-psu-blue space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-psu-blue/10 dark:bg-psu-light/10 text-psu-blue dark:text-psu-light flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Student Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Panichapon Chatdaeng (College of Computing)</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                Student Role
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Student ID / Identifier:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('6630613009', 'student_id')}
                  className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-psu-blue transition-colors cursor-pointer"
                >
                  6630613009
                  {copiedField === 'student_id' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Password:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('student123', 'student_pass')}
                  className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-psu-blue transition-colors cursor-pointer"
                >
                  student123
                  {copiedField === 'student_pass' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Link to="/signin">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Sign in as Student
                </Button>
              </Link>
            </div>
          </GlassCard>

          {/* Staff Card */}
          <GlassCard variant="card" className="p-5 border-l-4 border-l-amber-500 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Staff Supervisor Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Student Development & Alumni Relations Admin</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Staff / Admin Role
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Username / Identifier:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('staff', 'staff_user')}
                  className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  staff
                  {copiedField === 'staff_user' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Password:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('staff123', 'staff_pass')}
                  className="flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  staff123
                  {copiedField === 'staff_pass' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Sign in as Staff Supervisor
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* SECTION 2: Student Tester Journey */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-psu-navy dark:text-white">
              Student Journey Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Steps to test shift discovery, application rules, and tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Search className="w-4 h-4 text-psu-blue" />
              Browse & Filter Gigs
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Navigate to <strong>Jobs</strong> to search by role name, department (CoC, FHT, FIS, etc.), or allowance range.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Inspect Shift Details
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open any job to view specific dates, start/end shift times, seat capacities, and daily stipends.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" />
              Capacity & Rules
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Test safety guards: full jobs lock submissions automatically, and duplicate applications for the same job are rejected.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-purple-500" />
              Profile & Transcript
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visit <strong>Profile</strong> to track your application statuses, recorded activity transcript hours, and supervisor evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Staff & Supervisor Journey */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-psu-navy dark:text-white">
              Staff Supervisor Journey Walkthrough
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Steps to test posting gigs, reviewing student applications, and submitting evaluations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <BarChart3 className="w-4 h-4" />
              Dashboard Analytics
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sign in as <code>staff</code> and open <strong>Dashboard</strong> (`/admin/dashboard`) to view live KPIs: active jobs, open seats, student counts, and total stipends paid.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-psu-blue dark:text-psu-light font-bold text-sm">
              <PlusCircle className="w-4 h-4" />
              Post New Shift Listing
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Go to <strong>Jobs Management</strong> (`/admin/jobs/new`) to create a new part-time listing with multi-day shift schedules, allowance rates, and seat capacities.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Star className="w-4 h-4" />
              Applicant Evaluation
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open <strong>Applicants</strong> on any job to grade student performance with 5-star criteria: Punctuality, Responsibility, Grooming, and Quality.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Architecture & Technical Overview */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-psu-navy dark:text-white">
              System Architecture & Advisor Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Technical specifications following the midterm migration from Django to FastAPI & PostgreSQL.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-psu-blue font-bold mb-1">
              <Code2 className="w-4 h-4" />
              FastAPI 2.0
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              High-performance asynchronous Python backend with Uvicorn ASGI and Pydantic schemas.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-emerald-500 font-bold mb-1">
              <Database className="w-4 h-4" />
              PostgreSQL 15
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Containerized relational DB with SQLAlchemy ORM and sequence auto-increment synchronization.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-amber-500 font-bold mb-1">
              <Server className="w-4 h-4" />
              Tailscale Funnel
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Zero-friction HTTPS reverse proxy on dormitory server with automated port 443 routing.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-purple-500 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              PBKDF2 Auth
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Seamless JWT authentication retaining compatibility with Django password hashes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Notes */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 text-center text-xs text-slate-500 dark:text-slate-400">
        🎓 <strong>Digital Engineering Project II</strong> • College of Computing, Prince of Songkla University, Phuket Campus  
        <br />
        Project Advisor: <strong>Asst.Prof.Dr. Warodom Werapun</strong> • Student: <strong>Panichapon Chatdaeng (6630613009)</strong>
      </div>
    </InfoPageContainer>
  );
};

