import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="gradient-title text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Saved jobs
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          Roles you bookmarked for later.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {savedJobs?.length ? (
          savedJobs?.map((saved) => (
            <JobCard
              key={saved.id}
              job={saved?.job}
              onJobAction={fnSavedJobs}
              savedInit={true}
            />
          ))
        ) : (
          <Card className="col-span-full border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Bookmark className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">No saved jobs yet</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Browse listings and tap the heart on a card to save it here.
                </p>
              </div>
              <Button asChild>
                <Link to="/jobs">Browse jobs</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
