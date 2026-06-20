// features/cycle/hooks/useCycle.ts
import { useState, useEffect } from 'react';
import { CycleService } from '../services/cycleService';
export function useCycle(cycleId) {
    const [cycle, setCycle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const loadCycle = async () => {
            if (!cycleId)
                return;
            try {
                setLoading(true);
                const data = await CycleService.getCycleWithBuckets(cycleId);
                setCycle(data);
                setError('');
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load cycle');
            }
            finally {
                setLoading(false);
            }
        };
        loadCycle();
    }, [cycleId]);
    return { cycle, loading, error };
}
