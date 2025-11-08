import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image src="/logo.png" alt="SkillSwap Logo" width={24} height={24} />
      <span className="font-headline font-bold text-lg text-foreground">SkillSwap</span>
    </div>
  );
}
