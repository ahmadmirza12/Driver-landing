// app/page.js
import Layout from '@/components/sidebar';
import Dashboard from '@/components/dasboard';

export default function Page() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}