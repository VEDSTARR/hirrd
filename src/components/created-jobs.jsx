import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const JOBS_PER_PAGE = 6;

const CreatedJobs = () => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnCreatedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 🔥 Pagination Logic
  const totalPages = Math.ceil((createdJobs?.length || 0) / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const selectedJobs = createdJobs?.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="hsl(var(--primary))" />
      ) : (
        <>
          <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedJobs?.length ? (
              selectedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              ))
            ) : (
              <Card className="col-span-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">No jobs posted yet</p>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      Create your first listing to start receiving applicants.
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/post-job">Post a job</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 🔥 Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8 max-w-full overflow-x-auto">
              <PaginationContent className="flex-wrap justify-center gap-y-2 sm:flex-nowrap">

                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    className="cursor-pointer"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CreatedJobs;