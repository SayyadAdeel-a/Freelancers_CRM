import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  return (
    <div className={cn(
      "shrink-0 rounded-xl overflow-hidden relative",
      sizeMap[size],
      className
    )}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-lg animate-pulse" />
      <img 
        src="/logo.svg" 
        alt="Nudge CRM Logo" 
        className="relative w-full h-full object-contain" 
      />
    </div>
  );
}
