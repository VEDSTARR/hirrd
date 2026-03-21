import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-w-0">
      <div className="grid-background"></div>
      <main className="min-h-screen container max-w-full pb-6 sm:pb-0">
        <Header />
        <Outlet />
      </main>
      <div className="px-4 py-6 sm:p-10 text-center text-sm sm:text-base bg-gray-800 mt-6 sm:mt-10">
        Made by Kunal
      </div>
    </div>
  );
};

export default AppLayout;
