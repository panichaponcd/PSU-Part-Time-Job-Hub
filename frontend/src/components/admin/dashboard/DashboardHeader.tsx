import { FileDown } from 'lucide-react';

export interface DashboardHeaderProps {
  onExportPDF: () => void;
}

export function DashboardHeader({ onExportPDF }: DashboardHeaderProps) {
  return (
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
          onClick={onExportPDF}
          className="inline-flex items-center gap-2 bg-psu-navy hover:bg-[#003c71] dark:bg-psu-blue dark:hover:bg-[#00527f] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
        >
          <FileDown className="w-4 h-4 text-white" />
          <span>Export PDF Summary</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
