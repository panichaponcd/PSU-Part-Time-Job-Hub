import { motion } from 'framer-motion';
import { InfoPageContainer } from '../components/ui';

const personnel = [
  {
    role: 'Project Advisor',
    name: 'Asst. Prof. Dr. Kittasil Silanon',
    department: 'College of Computing',
    university: 'Prince of Songkla University, Phuket Campus',
    icon: '👨‍🏫',
  },
  {
    role: 'Co-Advisor',
    name: 'Assoc. Prof. Dr. Warodom Werapun',
    department: 'College of Computing',
    university: 'Prince of Songkla University, Phuket Campus',
    icon: '👨‍🏫',
  },
  {
    role: 'Co-Advisor',
    name: 'Dr. Thammarsat Visutarrom',
    department: 'College of Computing',
    university: 'Prince of Songkla University, Phuket Campus',
    icon: '👨‍🏫',
  },
  {
    role: 'Developer',
    name: 'Panichapon Chatdaeng',
    department: 'Digital Engineering (International Program)',
    university: 'College of Computing, PSU Phuket',
    studentId: '6630613009',
    icon: '👨‍💻',
  },
];

function Personnel() {
  return (
    <InfoPageContainer
      title="Project Personnel"
      subtitle="The academic advisors and development team"
      categoryTag="Project Leadership"
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col gap-4">
        {personnel.map((person, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-slate-200/80 dark:border-slate-700/80 group hover:border-psu-blue/40 dark:hover:border-psu-light/40 transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-psu-navy dark:bg-psu-blue flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-md border-2 border-white/20 transition-transform group-hover:scale-105">
              {person.icon}
            </div>

            <div className="flex-1">
              <p className="text-[10px] font-bold text-psu-blue dark:text-psu-light tracking-[0.2em] mb-1.5 uppercase">
                {person.role}
              </p>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight mb-1">
                {person.name}
              </h3>
              <div className="space-y-0.5">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold italic">
                  {person.department}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide">
                  {person.university}
                </p>
                {person.studentId && (
                  <p className="text-[10px] font-bold text-psu-blue dark:text-psu-light mt-2 inline-block px-2.5 py-0.5 bg-psu-blue/10 dark:bg-psu-light/10 rounded-md border border-psu-blue/20">
                    STUDENT ID: {person.studentId}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </InfoPageContainer>
  );
}

export default Personnel;
