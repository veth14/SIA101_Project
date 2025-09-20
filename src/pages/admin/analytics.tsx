import { AdminLayout } from '../../layouts/AdminLayout';
import { AnalyticsPage } from '../../components/analytics/AnalyticsPage';

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout title="Analytics & Reports">
      <AnalyticsPage />
    </AdminLayout>
  );
}
