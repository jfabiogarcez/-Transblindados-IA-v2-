import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div className={clsx('rounded-lg bg-neutral-900 border border-neutral-800 p-4', className)} {...props} />
  );
}
