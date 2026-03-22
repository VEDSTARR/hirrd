import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const closeSignIn = () => {
    setShowSignIn(false);
    setSearch({});
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSignIn();
    }
  };

  const signInModal =
    showSignIn &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex min-h-0 items-center justify-center overflow-y-auto bg-black/70 p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        onClick={handleOverlayClick}
      >
        <div
          className="relative my-auto w-full max-w-[100vw] sm:max-w-[440px]"
          onClick={(e) => e.stopPropagation()}
        >
          <SignIn
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-2xl",
              },
            }}
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <nav className="flex min-w-0 items-center justify-between gap-3 py-3 sm:py-4">
        <Link
          to="/"
          className="min-w-0 shrink-0 transition-opacity hover:opacity-90"
        >
          <img
            src="/logo.png"
            className="h-11 w-auto sm:h-16 md:h-20"
            alt="Hirrd Logo"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
          <SignedOut>
            <Button
              variant="outline"
              size="sm"
              className="sm:h-10 sm:px-4"
              onClick={() => setShowSignIn(true)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button
                  size="sm"
                  className="rounded-full px-3 text-sm sm:px-4 sm:text-base"
                >
                  <PenBox size={18} className="shrink-0 sm:mr-2" />
                  <span className="hidden sm:inline">Post a Job</span>
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 ring-2 ring-border",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {signInModal}
    </>
  );
};

export default Header;
