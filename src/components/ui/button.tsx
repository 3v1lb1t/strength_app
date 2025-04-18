import * as React from "react";

export const Button = React.forwardRef(({ className = "", ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 ${className}`}
    {...props}
  />
));