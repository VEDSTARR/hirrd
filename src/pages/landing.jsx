import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Building2, Search, Sparkles } from "lucide-react";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-14 py-6 sm:gap-24 sm:py-10">
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 px-4 py-12 text-center shadow-sm backdrop-blur-sm sm:px-8 sm:py-16 md:py-20">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
          aria-hidden
        />
        <Badge
          variant="secondary"
          className="relative mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Hire faster. Apply smarter.
        </Badge>
        <h1 className="relative text-balance font-extrabold tracking-tight">
          <span className="gradient-title block text-4xl sm:text-6xl lg:text-7xl">
            Find Your Dream Job
          </span>
          <span className="mt-3 flex flex-col items-center justify-center gap-2 text-3xl text-foreground sm:mt-4 sm:flex-row sm:gap-4 sm:text-5xl lg:text-6xl">
            <span className="text-muted-foreground">and get</span>
            <img
              src="/logo.png"
              className="h-12 w-auto sm:h-20 lg:h-28"
              alt="Hirrd"
            />
          </span>
        </h1>
        <p className="relative mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:mt-6 sm:text-lg">
          Explore thousands of listings, save roles you love, and connect with
          teams that match your goals.
        </p>
        <div className="relative mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center">
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button size="xl" className="w-full gap-2 sm:w-auto">
              <Search className="h-5 w-5" />
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job" className="w-full sm:w-auto">
            <Button
              size="xl"
              variant="outline"
              className="w-full border-primary/30 bg-background/50 sm:w-auto"
            >
              Post a Job
            </Button>
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-border/50 bg-muted/20 p-4 sm:p-6">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by teams at
        </p>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2200,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="flex items-center gap-6 sm:gap-12">
            {companies.map(({ name, id, path }) => (
              <CarouselItem
                key={id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <img
                  src={path}
                  alt={name}
                  className="mx-auto h-8 object-contain opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:h-12"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <div className="overflow-hidden rounded-2xl border border-border/40 shadow-lg">
        <img
          src="/banner.jpeg"
          alt=""
          className="max-h-[220px] w-full object-cover sm:max-h-[320px]"
        />
      </div>

      <section className="grid gap-4 md:grid-cols-2 md:gap-6">
        <Card className="group overflow-hidden">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">For job seekers</CardTitle>
            <CardDescription>
              Search, filter, and apply in one place. Save roles and track what
              matters to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built for clarity—no clutter, just roles that fit your skills and
            location.
          </CardContent>
        </Card>
        <Card className="group overflow-hidden">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
              <Building2 className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">For employers</CardTitle>
            <CardDescription>
              Publish openings, manage applicants, and keep hiring status in
              sync.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Reach candidates faster with a workflow that stays out of your way.
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border border-border/50 bg-card/30 p-4 sm:p-6">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border-border/60"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
};

export default LandingPage;
