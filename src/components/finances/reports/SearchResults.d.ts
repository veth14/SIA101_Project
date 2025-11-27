import React from 'react';
import type { FinancialReport } from '../../../data/financialReportsData';
interface SearchResultsProps {
    searchQuery: string;
    onClose: () => void;
    onOpenReport: (report: FinancialReport) => void;
}
declare const SearchResults: React.FC<SearchResultsProps>;
export default SearchResults;
