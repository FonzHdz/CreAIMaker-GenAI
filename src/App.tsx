import { useState } from 'react';
import { ProjectCreationMap } from './components/ProjectCreationMap';
import { GenIASection } from './components/GenIASection';

type CreationView = "map" | "genia" | null;

interface SectionProgress {
  genia: boolean;
  maker: boolean;
  aps: boolean;
}

export default function App() {
  const [creationView, setCreationView] = useState<CreationView>("map");
  const [sectionProgress, setSectionProgress] = useState<SectionProgress>({
    genia: false,
    maker: false,
    aps: false,
  });

  const handleStartSection = (section: "genia" | "maker" | "aps") => {
    if (section === "genia") {
      setCreationView("genia");
    }
  };

  const handleBackToMap = () => {
    setCreationView("map");
  };

  const handleCompleteGenIA = (data: { theme?: string; numStudents?: string; unidadAcademica?: string }) => {
    setSectionProgress((prev) => ({ ...prev, genia: true }));
    setCreationView("map");
  };

  // Show map
  if (creationView === "map") {
    return (
      <ProjectCreationMap
        onStartSection={handleStartSection}
        onBack={() => {}} // No hay "atrás" desde el mapa en esta versión simplificada
        completedSections={sectionProgress}
      />
    );
  }

  // Show GenIA section
  if (creationView === "genia") {
    return (
      <GenIASection
        onComplete={handleCompleteGenIA}
        onBack={handleBackToMap}
      />
    );
  }

  return null;
}
