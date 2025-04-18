import * as React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ${className}`}
    {...props}
  />
));
