"use client"
import Layout from '@/components/sidebar'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CreateOrder from '@/components/createOrder'

export default function CreateOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check for stored booking params after login
  useEffect(() => {
    const storedParams = sessionStorage.getItem('bookingParams');
    if (storedParams) {
      sessionStorage.removeItem('bookingParams');
      router.replace(`/screens/createOrder?${storedParams}`);
    }
  }, []);

  // Convert URLSearchParams to a plain object
  const getInitialData = () => {
    const params = {};
    
    // Get data from URL params
    searchParams.forEach((value, key) => {
      try {
        // Try to parse JSON for complex objects
        params[key] = JSON.parse(decodeURIComponent(value));
      } catch (e) {
        // If not JSON, use as is
        params[key] = value;
      }
    });

    return params;
  };

  return (
    <Layout>
      <CreateOrder initialData={getInitialData()} />
    </Layout>
  );
}