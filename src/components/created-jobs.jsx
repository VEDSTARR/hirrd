import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect, useState } from "react";

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
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <>
          {/* Jobs */}
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div>No Jobs Found 😢</div>
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