import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const AppLayout = () => {
  return (
    <div className="min-w-0">
      <div className="grid-background" aria-hidden />
      <div className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-full">
          <Header />
        </div>
      </div>
      <main className="min-h-[calc(100vh-4rem)] container max-w-full pb-10 pt-4 sm:pt-6">
        <Outlet />
      </main>
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container max-w-full py-8 text-center text-sm text-muted-foreground">
          <Separator className="mb-6 opacity-50" />
          Made by Kunal
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
