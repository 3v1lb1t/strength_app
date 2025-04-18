import * as React from "react";

export const Card = ({ className = "", ...props }) => (
  <div className={`rounded-lg border bg-white text-black shadow-sm ${className}`} {...props} />
);

export const CardHeader = ({ className = "", ...props }) => (
  <div className={`px-6 py-4 border-b text-lg font-semibold ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props} />
);