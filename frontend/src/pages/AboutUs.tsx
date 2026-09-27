import { InfoPageContainer } from '../components/ui';

function AboutUs() {
  const objectives = [
    {
      icon: '🏛️',
      title: 'Centralization',
      desc: 'A single web-based hub for all PSU Phuket student employment and social activities.',
    },
    {
      icon: '⭐',
      title: 'Performance Tracking',
      desc: 'A digital 5-star evaluation system to build student professional profiles.',
    },
    {
      icon: '⚡',
      title: 'Automation',
      desc: 'Automated generation of work reports and PDF certificates to reduce manual paperwork.',
    },
  ];

  const benefits = [
    'Find part-time jobs and social activities in one convenient platform',
    'Track your application status in real-time',
    'Build a digital work history and professional profile',
    'Download work certificates automatically after job completion',
    'Receive performance evaluations to improve professional skills',
    'Gain real-world experience alongside your studies',
  ];

  return (
    <InfoPageContainer
      title="PSU Part-time Job Hub"
      subtitle="Prince of Songkla University, Phuket Campus"
      categoryTag="About the Initiative"
    >
      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-psu-blue dark:text-psu-light">●</span> What is PSU Part-time Job Hub?
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm">
          <p>
            PSU Part-time Job Hub is a centralized web platform designed to streamline
            part-time employment and social activity opportunities for all students at
            Prince of Songkla University, Phuket Campus.
          </p>
          <p>
            Previously, job opportunities were scattered across LINE groups and physical
            notice boards, causing students to miss opportunities and creating significant
            administrative burden for the Student Development and Alumni Relations office.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {objectives.map((item) => (
            <div
              key={item.title}
              className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-6 text-center border border-slate-200/80 dark:border-slate-700/80 transition-all hover:border-psu-blue/40"
            >
              <div className="text-4xl mb-4 filter drop-shadow-sm">{item.icon}</div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-xs uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Benefits for Students</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          {benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-semibold list-none"
            >
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span className="text-sm leading-relaxed">{benefit}</span>
            </li>
          ))}
        </div>
      </section>

      <section className="pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          <div className="space-y-3">
            <p className="flex items-center gap-3">
              📍 <span>SD & Alumni Relations Office</span>
            </p>
            <p className="flex items-center gap-3">
              🏫 <span>PSU Phuket Campus</span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="flex items-center gap-3">
              📞 <span>076-276-000</span>
            </p>
            <p className="flex items-center gap-3 lowercase">
              🌐{' '}
              <a
                href="https://phuket.psu.ac.th"
                target="_blank"
                rel="noreferrer"
                className="text-psu-blue dark:text-psu-light hover:underline font-bold uppercase tracking-wider"
              >
                phuket.psu.ac.th
              </a>
            </p>
          </div>
        </div>
      </section>
    </InfoPageContainer>
  );
}

export default AboutUs;
