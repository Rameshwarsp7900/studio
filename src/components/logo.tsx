import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 14.21 16.97 16.16 15.25 17.22L16.7 18.7C18.97 17.2 20.5 14.78 20.5 12C20.5 7.31 16.69 3.5 12 3.5V4Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
        <path
          d="M12 18V23L16 19L12 15V18C8.69 18 6 15.31 6 12C6 9.79 7.03 7.84 8.75 6.78L7.3 5.3C5.03 6.8 3.5 9.22 3.5 12C3.5 16.69 7.31 20.5 12 20.5V18Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-headline font-bold text-lg text-foreground">SkillSwap</span>
    </div>
  );
}
