import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded && id) fnJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch when route id changes
  }, [isLoaded, id]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return (
      <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />
    );
  }

  return (
    <div className="mt-2 flex min-w-0 flex-col gap-6 sm:mt-4 sm:gap-8">
      <div className="flex flex-col-reverse items-start justify-between gap-4 sm:gap-6 md:flex-row md:items-center">
        <h1 className="gradient-title max-w-full break-words pb-1 text-3xl font-extrabold sm:pb-3 sm:text-5xl md:text-6xl">
          {job?.title}
        </h1>
        <img
          src={job?.company?.logo_url}
          className="h-10 shrink-0 rounded-lg border border-border/50 bg-card p-1 sm:h-12"
          alt=""
        />
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="grid grid-cols-1 gap-4 p-4 text-sm sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-3 lg:text-base">
          <div className="flex min-w-0 items-center gap-2">
            <MapPinIcon className="shrink-0 text-primary" size={18} />
            <span className="break-words text-muted-foreground">
              {job?.location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="shrink-0 text-primary" />
            <span className="text-muted-foreground">
              {job?.applications?.length} applicants
            </span>
          </div>
          <div className="flex items-center gap-2">
            {job?.isOpen ? (
              <Badge className="gap-1 border-primary/30 bg-primary/15 font-normal text-primary">
                <DoorOpen size={14} className="shrink-0" /> Open
              </Badge>
            ) : (
              <Badge
                variant="destructive"
                className="gap-1 font-normal opacity-90"
              >
                <DoorClosed size={14} className="shrink-0" /> Closed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {job?.recruiter_id === user?.id && (
        <Select
          value={job?.isOpen ? "open" : "closed"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger
            className={`w-full rounded-lg border-border/60 ${
              job?.isOpen
                ? "border-primary/40 bg-primary/10"
                : "border-destructive/40 bg-destructive/10"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        About the job
      </h2>
      <p className="leading-relaxed text-muted-foreground sm:text-lg">
        {job?.description}
      </p>

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        What we are looking for
      </h2>
      <div className="w-full min-w-0 overflow-x-auto">
        <MDEditor.Markdown
          source={job?.requirements}
          className="bg-transparent sm:text-lg min-w-0" // add global ul styles - tutorial
        />
      </div>
      {user && job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      {!user && job?.isOpen && (
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/?sign-in=true">Sign in to apply</Link>
        </Button>
      )}
      {loadingHiringStatus && (
        <BarLoader width={"100%"} color="hsl(var(--primary))" />
      )}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="mb-4 ml-1 text-xl font-bold tracking-tight">
            Applications
          </h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;
