import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { ButtonProps } from '@/types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, asChild, ...props }, ref) => {
    // If asChild is true, render children directly (for composition patterns)
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-700',
          variant === 'outline' && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
          variant === 'ghost' && 'text-gray-700 hover:bg-gray-100',
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-11 px-4 text-base',
          size === 'lg' && 'h-12 px-6 text-lg',
          className,
          (children as React.ReactElement).props.className
        ),
      });
    }
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm min-w-[44px]', // WCAG minimum touch target
      md: 'h-11 px-4 text-base min-w-[44px]',
      lg: 'h-12 px-6 text-lg min-w-[44px]',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };