import { ComponentProps } from "react";

export function Label({ htmlFor, children, ...props }: { htmlFor?: string } & ComponentProps<"label">) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
      {...props}
    >
      {children}
    </label>
  );
} 