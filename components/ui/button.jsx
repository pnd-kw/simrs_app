import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        radial:
          "bg-[radial-gradient(circle_at_center,_#3776A1,_#003A6B)] rounded-full",
        white: "bg-white",
        transparent: "bg-transparent",
        gray: "bg-grey1 rounded-md uppercase text-white text-xs font-semibold",
        red1: "bg-red1 rounded-md uppercase text-white text-xs font-semibold hover:bg-red2 cursor-pointer",
        red2: "bg-red2 rounded-md uppercase text-white text-xs font-semibold hover:bg-red1 cursor-pointer",
        primaryGradient:
          "bg-gradient-to-b from-primary1 to-primary2 text-white cursor-pointer",
        lightBlue:
          "bg-blue1 rounded-md uppercase text-white text-xs font-semibold hover:opacity-80 cursor-pointer",
        skyBlue:
          "bg-blue2 rounded-md uppercase text-white text-xs font-semibold hover:opacity-80 cursor-pointer",
        yellow1:
          "bg-yellow1 rounded-md uppercase text-white text-xs font-semibold hover:opacity-80 cursor-pointer",
        yellow2:
          "bg-yellow2 rounded-md uppercase text-white text-xs font-semibold",
        primary1:
          "bg-primary1 rounded-md uppercase text-white text-xs font-semibold hover:bg-primary3 cursor-pointer",
        primary2:
          "bg-primary2 rounded-md uppercase text-white text-xs font-semibold hover:bg-primary3 cursor-pointer",
        primary3:
          "bg-primary3 rounded-md uppercase text-white text-xs font-semibold hover:bg-primary2 cursor-pointer",
        outlined: "border-1 border-stone-200 rounded-md text-xs font-semibold",
        outlinedGreen1: "border border-primary1 text-stone-900 cursor-pointer",
        outlinedGreen2:
          "border border-primary1 text-primary1 rounded-md uppercase text-xs font-semibold cursor-pointer hover:bg-primary3 hover:text-white hover:border-primary3",
        sidebarTrigger: "bg-[#EEE8E8] rounded-full shadow-md",
        text: "bg-transparent text-blue1",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 px-2 has-[>svg]:px-2",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        text: "min-h-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
