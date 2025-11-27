interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
}
interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    onSort?: (key: string, direction: 'asc' | 'desc') => void;
    onRowClick?: (row: any) => void;
    actions?: (row: any) => React.ReactNode;
}
export declare const DataTable: ({ columns, data, loading, onSort, onRowClick, actions }: DataTableProps) => import("react/jsx-runtime").JSX.Element;
export {};
