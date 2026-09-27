import { Trophy } from 'lucide-react';
import { InfoPageContainer, EmptyState } from '../components/ui';

function HallOfFame() {
  return (
    <InfoPageContainer
      title="Student Hall of Fame"
      subtitle="Recognizing top-performing student workers across PSU Phuket"
      categoryTag="Excellence Honors"
      maxWidth="max-w-4xl"
    >
      <EmptyState
        icon={Trophy}
        title="Coming Soon"
        description="The Hall of Fame will showcase highest-rated student workers based on supervisor performance evaluations. Check back after semester evaluations are finalized."
      />
    </InfoPageContainer>
  );
}

export default HallOfFame;
