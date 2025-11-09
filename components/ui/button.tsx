import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyle = 'px-4 py-2 rounded-lg text-sm font-medium focus:outline-none';
    let variantStyle = '';
    switch (variant) {
      case 'primary':
        variantStyle = 'bg-amber-500 text-neutral-950 hover:bg-amber-400';
        break;
      case 'secondary':
        variantStyle = 'bg-neutral-800 text-white hover:bg-neutral-700';
        break;
      default:
        variantStyle = 'bg-neutral-700 text-white hover:bg-neutral-600';
        break;
    }
    return (
      <button ref={ref} className={clsx(baseStyle, variantStyle, className)} {...props} />
    );
  }
);

Button.displayName = 'Button';
export { Button };
