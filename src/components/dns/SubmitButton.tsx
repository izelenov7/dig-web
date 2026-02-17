import React, { useCallback } from 'react';
import { Button } from '../ui';
import { useDnsStore } from '../../store';

interface SubmitButtonProps {
  onSubmit?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  const { domain, status, resetForm, clearResult } = useDnsStore();

  const isLoading = status === 'loading';
  const isDisabled = !domain.trim() || isLoading;

  const handleClick = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const handleReset = useCallback(() => {
    resetForm();
    clearResult();
  }, [resetForm, clearResult]);

  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handleClick}
        disabled={isDisabled}
        isLoading={isLoading}
        className="flex-1 sm:flex-none sm:min-w-[200px]"
        leftIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      >
        {isLoading ? 'Запрос...' : 'Выполнить Dig'}
      </Button>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleReset}
        title="Сбросить форму"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </Button>
    </div>
  );
};
