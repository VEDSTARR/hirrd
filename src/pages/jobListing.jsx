import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import { Briefcase } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

const JOBS_PER_PAGE = 6;

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const totalPages = Math.ceil((jobs?.length || 0) / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const selectedJobs = jobs?.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) {
      setSearchQuery(query);
      setCurrentPage(1);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setCurrentPage(1);
  };

  if (!isLoaded) {
    return <BarLoader width={"100%"} color="hsl(var(--primary))" />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="gradient-title text-balance pb-1 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Latest jobs
        </h1>
        <p className="text-muted-foreground sm:text-lg">
          Search and filter roles that match your next move.
        </p>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Search & filters</CardTitle>
          <CardDescription>
            Refine by title, state, or company—results update as you go.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-2 sm:h-12 sm:flex-row sm:items-stretch"
          >
            <Input
              type="text"
              placeholder="Search by job title…"
              name="search-query"
              className="h-12 flex-1 min-w-0 rounded-lg border-border/60 bg-background/80 px-4 text-base"
            />
            <Button
              type="submit"
              className="h-12 w-full shrink-0 sm:w-32"
              variant="blue"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-col gap-2 min-w-0 sm:flex-row sm:flex-wrap">
            <Select
              value={location}
              onValueChange={(v) => {
                setLocation(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-lg border-border/60 bg-background/80 sm:min-w-[200px] sm:flex-1">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={company_id}
              onValueChange={(v) => {
                setCompany_id(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-lg border-border/60 bg-background/80 sm:min-w-[200px] sm:flex-1">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({ name, id }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 w-full shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {loadingJobs && (
        <BarLoader width={"100%"} color="hsl(var(--primary))" />
      )}

      {!loadingJobs && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedJobs?.length ? (
              selectedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            ) : (
              <Card className="col-span-full border-dashed">
                <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                    <Briefcase className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">No jobs found</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Try another search term or clear filters to see all open
                    roles.
                  </p>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Reset filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8 max-w-full overflow-x-auto">
              <PaginationContent className="flex-wrap justify-center gap-y-2 sm:flex-nowrap">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
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

export default JobListing;
