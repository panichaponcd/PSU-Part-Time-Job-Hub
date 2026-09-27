function Footer() {
  return (
    <footer className="relative z-30 w-full bg-[#1A365D] dark:bg-[#070D1E] text-white py-5 px-4 sm:px-6 transition-colors duration-200 border-t border-slate-700/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <p className="text-xs sm:text-sm font-semibold tracking-wide">
            © 2026 - Student Development and Alumni Relations
          </p>
          <p className="text-[11px] sm:text-xs text-slate-300 dark:text-slate-400 mt-0.5">
            Prince of Songkla University, Phuket Campus
          </p>
        </div>
        <div className="text-[11px] text-slate-300 dark:text-slate-400 flex items-center gap-4">
          <span className="font-mono text-xs text-psu-light">PSU Part-Time Job Hub</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
