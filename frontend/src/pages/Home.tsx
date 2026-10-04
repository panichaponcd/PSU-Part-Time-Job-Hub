import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  Sparkles,
  Award,
  Users,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import bgImage2 from '../assets/home-bg-2.jpg';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isLoggedIn } = useAuth();

  const metrics = [
    { value: '10+', label: 'Active Shifts & Gigs', icon: Briefcase },
    { value: '฿400 - 1,200', label: 'Daily / Shift Allowance', icon: Award },
    { value: '420+', label: 'Shifts Completed', icon: Users },
    { value: '100 hrs', label: 'Activity Hours Recorded', icon: Clock },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Browse Campus Shifts & Roles',
      description:
        'Explore verified campus shifts, departmental assistant roles, and university events tailored to your class schedule.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Sign Up & Reserve Shift',
      description:
        'Log in with your PSU Passport, apply in one click, and receive shift confirmation instantly.',
      icon: CheckCircle2,
    },
    {
      step: '03',
      title: 'Complete Work & Log Hours',
      description:
        'Check in at the venue, get verified by supervising staff, and collect shift allowance plus certified activity transcript hours.',
      icon: Clock,
    },
  ];

  return (
    <PageTransition>
      <div className="w-full flex flex-col">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[calc(100vh-72px)] flex flex-col justify-center items-center overflow-hidden bg-psu-navy py-16 px-4 sm:px-6 lg:px-8">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0 bg-[#0b132b] overflow-hidden pointer-events-none select-none">
            <img
              src={bgImage}
              alt=""
              aria-hidden="true"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-[center_45%] pointer-events-none select-none transform-gpu"
            />
            {/* Ambient Radial & Linear Contrast Gradients */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 30%, rgba(20, 35, 60, 0.4) 0%, rgba(10, 24, 45, 0.75) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(10, 24, 45, 0.6) 80%)',
              }}
            />
            <div className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/75 pointer-events-none" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center text-center text-white pt-4 pb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight drop-shadow-2xl">
              Find Part-time Jobs in the Phuket Campus
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-slate-100/90 max-w-2xl drop-shadow-md font-normal leading-relaxed">
              A hub for part-time jobs and social activities for all PSU Phuket students
            </p>

            <Link to="/jobs">
              <Button
                variant="primary"
                size="lg"
                className="px-9 py-3.5 text-base sm:text-lg font-bold shadow-xl bg-psu-blue hover:bg-[#003c71] dark:bg-psu-light dark:hover:bg-psu-blue dark:text-slate-950 dark:hover:text-white transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span>Search Part-time Jobs</span>
              </Button>
            </Link>

            {/* Metrics Glassmorphic Card Bar */}
            <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700/50 shadow-2xl py-5 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={idx}
                    className={`p-2 flex flex-col items-center justify-center ${
                      idx !== 0 ? 'border-l border-white/15' : ''
                    } ${idx === 2 ? 'border-l-0 md:border-l' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/15 dark:bg-white/10 flex items-center justify-center mb-1.5 text-psu-light">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-0.5">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-200/90 font-medium">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS SECTION                                                      */}
        {/* ========================================================================= */}
        <section className="relative w-full bg-slate-50 dark:bg-[#0b132b] border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-psu-blue/10 text-psu-blue dark:bg-psu-light/10 dark:text-psu-light mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Simple Workflow
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                How It Works
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-xl mx-auto">
                Simple, transparent 3-step process to earn allowances and certified activity hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {workflowSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 text-left shadow-sm hover:shadow-md hover:border-psu-blue/40 dark:hover:border-psu-light/40 transition-all transform hover:-translate-y-1 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-lg mb-5 shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-xs uppercase tracking-widest text-psu-blue dark:text-psu-light font-bold mb-1.5">
                      Step {step.step}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2.5">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CALL TO ACTION (CTA) BANNER                                               */}
        {/* ========================================================================= */}
        <section className="relative w-full overflow-hidden text-white px-4 sm:px-6 lg:px-8 py-20 sm:py-24 border-t border-slate-700/40">
          {/* Aerial Campus Backdrop Image */}
          <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden pointer-events-none select-none">
            <img
              src={bgImage2}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[center_40%] pointer-events-none select-none transform-gpu"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(20, 35, 60, 0.45) 0%, rgba(10, 24, 45, 0.8) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(10, 24, 45, 0.7) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/75 pointer-events-none" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 drop-shadow-lg">
              Ready to Gain Experience and Earn on Campus?
            </h2>
            <p className="text-sm sm:text-base text-slate-100/90 max-w-xl mb-8 leading-relaxed drop-shadow-md">
              Join PSU Phuket students building career skills, networking with departments, and logging certified activity hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link to="/jobs" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-3 text-base font-bold bg-psu-blue hover:bg-[#003c71] text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <span>Browse Available Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              {!isLoggedIn() && (
                <Link to="/signin" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-3 text-base font-semibold border-white/40 text-white hover:bg-white/10 backdrop-blur-sm cursor-pointer transform hover:-translate-y-0.5 active:scale-95 transition-all"
                  >
                    Sign In with PSU Passport
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default Home;
