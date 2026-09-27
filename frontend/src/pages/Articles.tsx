import { Newspaper } from 'lucide-react';
import { InfoPageContainer, EmptyState } from '../components/ui';

function Articles() {
  return (
    <InfoPageContainer
      title="Articles & Announcements"
      subtitle="News, university directives, and student career announcements"
      categoryTag="Campus News"
      maxWidth="max-w-4xl"
    >
      <EmptyState
        icon={Newspaper}
        title="No Articles Yet"
        description="Articles and announcements will appear here when published by the Student Development office."
      />
    </InfoPageContainer>
  );
}

export default Articles;
