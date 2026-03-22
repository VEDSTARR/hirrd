import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />
    );
  }

  const isCandidate = user?.unsafeMetadata?.role === "candidate";

  return (
    <div className="min-w-0 space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="gradient-title text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {isCandidate ? "My applications" : "My jobs"}
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          {isCandidate
            ? "Track roles you have applied to."
            : "Manage listings you have posted."}
        </p>
      </div>
      {isCandidate ? <CreatedApplications /> : <CreatedJobs />}
    </div>
  );
};

export default MyJobs;
