'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = '', containerClassName = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className={`relative ${containerClassName}`}>
        <input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`pr-10 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 focus:outline-none dark:text-neutral-500 dark:hover:text-neutral-300"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 transition-transform active:scale-95" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5 transition-transform active:scale-95" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
