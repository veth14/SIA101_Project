interface DateRange {
    startDate: string;
    endDate: string;
}
interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
}
export declare const DateRangePicker: ({ value, onChange, className }: DateRangePickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
