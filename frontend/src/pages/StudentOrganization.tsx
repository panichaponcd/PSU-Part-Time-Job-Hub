import { InfoPageContainer, Button } from '../components/ui';

function StudentOrganization() {
  return (
    <InfoPageContainer
      title="Student Organization"
      subtitle="Student Development and Alumni Relations Office"
      categoryTag="University Unit"
      maxWidth="max-w-4xl"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-psu-blue dark:text-psu-light">●</span> About the Office
        </h2>
        <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm">
          <p>
            The Student Development and Alumni Relations Office at PSU Phuket Campus is
            responsible for supporting student activities, part-time employment,
            extracurricular development, and alumni engagement.
          </p>
          <p>
            The office manages the PSU Activity Transcript system, coordinates part-time job
            placements for students, issues work certificates, and organizes activities that
            contribute to student development both academically and professionally.
          </p>
        </div>
      </section>

      <section className="pt-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          PSU Activity Transcript
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm">
          The PSU Activity Transcript system records student participation in extracurricular
          activities throughout their studies. Students are required to accumulate a minimum of
          100 activity hours, consisting of at least 50 hours of student development activities
          and 50 hours of elective activities.
        </p>

        <div className="pt-2">
          <a
            href="https://student.psu.ac.th/transcript/"
            target="_blank"
            rel="noreferrer"
            className="inline-block"
          >
            <Button variant="primary" className="inline-flex items-center gap-2 px-6 py-3 cursor-pointer">
              <span>Visit PSU Transcript System</span>
              <span className="text-lg">→</span>
            </Button>
          </a>
        </div>
      </section>
    </InfoPageContainer>
  );
}

export default StudentOrganization;
