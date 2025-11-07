import Link from "next/link";
import { Logo } from "@/components/logo";
import { Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
