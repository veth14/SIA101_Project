import React from 'react';
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'green' | 'blue' | 'purple';
}
export declare const ProgressBar: React.FC<ProgressBarProps>;
interface StepProgressProps {
    steps: {
        label: string;
        completed: boolean;
    }[];
    currentStep: number;
}
export declare const StepProgress: React.FC<StepProgressProps>;
interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    showText?: boolean;
}
export declare const CircularProgress: React.FC<CircularProgressProps>;
export {};
