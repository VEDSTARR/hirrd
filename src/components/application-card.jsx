/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card>
      {loadingHiringStatus && (
        <BarLoader width={"100%"} color="hsl(var(--primary))" />
      )}
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 font-bold">
          <span className="break-words min-w-0 pr-1">
            {isCandidate
              ? `${application?.job?.title} at ${application?.job?.company?.name}`
              : application?.name}
          </span>
          <Download
            size={18}
            className="h-8 w-8 shrink-0 cursor-pointer self-end rounded-full bg-muted p-1.5 text-foreground sm:self-start"
            onClick={handleDownload}
            aria-label="Download resume"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-x-6 md:gap-y-2 justify-between">
          <div className="flex gap-2 items-start min-w-0">
            <BriefcaseBusiness size={15} className="shrink-0 mt-0.5" />{" "}
            <span>{application?.experience} years of experience</span>
          </div>
          <div className="flex gap-2 items-center min-w-0">
            <School size={15} className="shrink-0" />
            {application?.education}
          </div>
          <div className="flex gap-2 items-start min-w-0 md:min-w-[200px]">
            <Boxes size={15} className="shrink-0 mt-0.5" />{" "}
            <span className="break-words">Skills: {application?.skills}</span>
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <span className="text-sm text-muted-foreground break-all">
          {new Date(application?.created_at).toLocaleString()}
        </span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-full sm:w-52 max-w-full">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
