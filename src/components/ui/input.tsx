import * as React from "react";

export const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${className}`}
    {...props}
  />
));
