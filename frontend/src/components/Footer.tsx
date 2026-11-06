import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative z-30 w-full bg-[#1A365D] dark:bg-[#070D1E] text-white py-5 px-4 sm:px-6 border-t border-slate-700/30">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-1.5">
        <p className="text-xs sm:text-sm font-semibold tracking-wide">
          © 2026 - Student Development and Alumni Relations
        </p>
        <p className="text-[11px] sm:text-xs text-slate-300 dark:text-slate-400">
          Prince of Songkla University, Phuket Campus
        </p>
        <div className="flex items-center gap-3 text-[11px] text-slate-300 dark:text-slate-400 mt-1">
          <Link to="/guide" className="hover:text-white underline-offset-2 hover:underline transition-colors">
            User Guide & Demo Accounts
          </Link>
          <span>•</span>
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline-offset-2 hover:underline transition-colors"
          >
            API Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
