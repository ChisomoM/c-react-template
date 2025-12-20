import { useState, useEffect } from 'react';
import { FirebaseFirestore } from '@/lib/firebase/firestore';
import type { JoinZuteFormData } from '@/types/join-zute';
import { Timestamp } from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  province?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface AnalyticsData extends JoinZuteFormData {
  id: string;
}

export const useAnalyticsData = (filters: AnalyticsFilters = {}, collectionName: string = 'join_requests') => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const constraints: QueryConstraint[] = [];

        // Add date range filter if provided
        if (filters.startDate) {
          constraints.push(FirebaseFirestore.where('createdAt', '>=', Timestamp.fromDate(filters.startDate)));
        }
        if (filters.endDate) {
          // Set end date to end of day
          const endOfDay = new Date(filters.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          constraints.push(FirebaseFirestore.where('createdAt', '<=', Timestamp.fromDate(endOfDay)));
        }

        // Add status filter if provided
        if (filters.status) {
          constraints.push(FirebaseFirestore.where('status', '==', filters.status));
        }

        // Order by createdAt descending (most recent first)
        constraints.push(FirebaseFirestore.orderBy('createdAt', 'desc'));

        const result = await FirebaseFirestore.getCollection(collectionName, constraints);
        setData(result as AnalyticsData[]);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.startDate, filters.endDate, filters.status, collectionName]);

  return { data, loading, error };
};