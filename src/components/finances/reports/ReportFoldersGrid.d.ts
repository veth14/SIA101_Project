import React from 'react';
interface ReportFoldersGridProps {
    onFolderClick: (categoryId: string) => void;
    selectedCategory?: string;
    searchQuery?: string;
    isLoading?: boolean;
}
declare const ReportFoldersGrid: React.FC<ReportFoldersGridProps>;
export default ReportFoldersGrid;
