// features/cycle/hooks/useCycle.ts
import { useState, useEffect } from 'react';
import { CycleService } from '../services/cycleService';
import type { Cycle, CycleWithBuckets } from '@shared/types';

export function useCycle(cycleId: string | undefined) {
  const [cycle, setCycle] = useState<CycleWithBuckets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadCycle = async () => {
      if (!cycleId) return;

      try {
        setLoading(true);
        const data = await CycleService.getCycleWithBuckets(cycleId);
        setCycle(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cycle');
      } finally {
        setLoading(false);
      }
    };

    loadCycle();
  }, [cycleId]);

  return { cycle, loading, error };
}