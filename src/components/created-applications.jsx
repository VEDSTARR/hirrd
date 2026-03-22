import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect, useState } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { FileText } from "lucide-react";
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
    return (
      <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {selectedApplications?.length ? (
        selectedApplications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">No applications yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Find a role you like and submit an application to see it here.
              </p>
            </div>
            <Button asChild>
              <Link to="/jobs">Browse jobs</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 🔥 Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6 max-w-full overflow-x-auto">
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
    </div>
  );
};

export default CreatedApplications;