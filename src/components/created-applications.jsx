import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect, useState } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const APPLICATIONS_PER_PAGE = 5;

const CreatedApplications = () => {
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 🔥 Pagination Logic
  const totalPages = Math.ceil(
    (applications?.length || 0) / APPLICATIONS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * APPLICATIONS_PER_PAGE;
  const selectedApplications = applications?.slice(
    startIndex,
    startIndex + APPLICATIONS_PER_PAGE
  );

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Applications */}
      {selectedApplications?.length ? (
        selectedApplications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        <div>No Applications Found 😢</div>
      )}

      {/* 🔥 Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>

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
    </div>
  );
};

export default CreatedApplications;