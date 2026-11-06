import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, BookOpen, Check, ShieldAlert, User, ShieldCheck } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface TestingNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingNoticeModal: FC<TestingNoticeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleAcknowledge = () => {
    sessionStorage.setItem('psu_testing_notice_acknowledged', 'true');
    onClose();
  };

  const handleOpenGuide = () => {
    sessionStorage.setItem('psu_testing_notice_acknowledged', 'true');
    onClose();
    navigate('/guide');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleAcknowledge}
      title="Prototype & Testing Environment"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-slate-700 dark:text-slate-200">
        {/* Banner Alert */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-amber-900 dark:text-amber-200">Demonstration Notice: </span>
            This platform is an academic prototype for the{' '}
            <strong className="text-amber-900 dark:text-amber-200">PSU Phuket Digital Engineering Final Project</strong>. All jobs, student profiles, shifts, and allowances are simulated mock data for system evaluation.
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          You are welcome to explore and test both the <strong>Student Applicant</strong> journey and the <strong>Staff Supervisor</strong> evaluation workflow using our pre-seeded accounts:
        </p>

        {/* Quick Credentials Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-bold text-psu-navy dark:text-psu-light mb-1">
              <User className="w-3.5 h-3.5 text-psu-blue" />
              Student Tester
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              ID: <code className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-1 py-0.5 rounded">6630613009</code>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Pass: <code className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-1 py-0.5 rounded">student123</code>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Staff / Admin
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              User: <code className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-1 py-0.5 rounded">staff</code>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Pass: <code className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-1 py-0.5 rounded">staff123</code>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenGuide}
            className="flex-1 w-full justify-center"
          >
            <BookOpen className="w-4 h-4" />
            Open User Guide
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleAcknowledge}
            className="flex-1 w-full justify-center"
          >
            <Check className="w-4 h-4" />
            I Understand
          </Button>
        </div>
      </div>
    </Modal>
  );
};

