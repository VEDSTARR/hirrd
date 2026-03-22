/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    if (!user?.id) return;
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  const preview =
    job.description?.indexOf(".") > -1
      ? `${job.description.substring(0, job.description.indexOf("."))}.`
      : job.description;

  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="hsl(var(--primary))" />
      )}
      <CardHeader className="flex min-w-0 pb-3">
        <CardTitle className="flex w-full min-w-0 items-start justify-between gap-2 text-lg font-semibold leading-snug">
          <span className="min-w-0 break-words pr-1">{job.title}</span>
          {isMyJob && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={handleDeleteJob}
              aria-label="Delete job"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {job.company && (
            <img
              src={job.company.logo_url}
              className="h-7 w-auto object-contain"
              alt=""
            />
          )}
          <Badge variant="outline" className="w-fit gap-1.5 font-normal">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span className="break-words">{job.location}</span>
          </Badge>
        </div>
        <Separator />
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {preview}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More details
          </Button>
        </Link>
        {!isMyJob && (
          <>
            <SignedIn>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={handleSaveJob}
                disabled={loadingSavedJob}
                aria-label={saved ? "Unsave job" : "Save job"}
              >
                {saved ? (
                  <Heart size={18} className="fill-primary text-primary" />
                ) : (
                  <Heart size={18} />
                )}
              </Button>
            </SignedIn>
            <SignedOut>
              <Button variant="outline" size="sm" className="shrink-0" asChild>
                <Link to="/?sign-in=true" aria-label="Sign in to save jobs">
                  Save
                </Link>
              </Button>
            </SignedOut>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
