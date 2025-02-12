import { FC } from "react";

export const Icons: { [key: string]: FC<{ className?: string }> } = {
  logo: ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0L24 22H0L12 0z" />
    </svg>
  ),
};
