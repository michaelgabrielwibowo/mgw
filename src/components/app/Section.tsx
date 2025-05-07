import { cn } from "@/lib/utils";
import type React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function Section({ title, children, className, titleClassName }: SectionProps) {
  return (
    <section className={cn("py-8 md:py-12 w-full", className)}>
      <h2 className={cn("text-3xl md:text-4xl font-semibold mb-6 md:mb-8 text-primary text-center", titleClassName)}>
        {title}
      </h2>
      {children}
    </section>
  );
}
