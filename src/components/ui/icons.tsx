import { SVGProps } from 'react';

export function JuiceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 2h8l2 4H6l2-4z" />
      <path d="M6 6v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6" />
      <path className="juice-wave" d="M6 10h12" />
      <path className="juice-wave" d="M6 14h12" />
      <path className="juice-wave" d="M6 18h12" />
    </svg>
  );
}