import React from 'react';
interface PaymentsStatsProps {
    payments: Array<{
        status: string;
        amount: number;
    }>;
}
declare const PaymentsStats: React.FC<PaymentsStatsProps>;
export default PaymentsStats;
export { PaymentsStats };
