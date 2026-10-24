import { cn } from "cn"

function Kbd({ className, size = "default", ...props }: React.ComponentProps<"kbd"> & { size?: "default" | "guide" }) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        size === "guide" ? "min-h-8 min-w-8 px-2 text-sm" : "h-5 min-w-5 text-xs",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
