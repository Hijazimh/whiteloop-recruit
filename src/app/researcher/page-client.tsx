"use client";

import { useState } from "react";
import { CreateProjectWizard } from "./create-project-wizard";

interface ResearcherPageClientProps {
  children: React.ReactNode;
}

export function ResearcherPageClient({ children }: ResearcherPageClientProps) {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <>
      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('a[href="#create-project"]')) {
            e.preventDefault();
            setWizardOpen(true);
          }
        }}
      >
        {children}
      </div>
      {wizardOpen ? (
        <CreateProjectWizard open={wizardOpen} onOpenChange={setWizardOpen} />
      ) : null}
    </>
  );
}
