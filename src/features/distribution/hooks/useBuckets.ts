import { useState, useEffect } from 'react'
import { BucketService } from '@/shared/services/bucketService'
import type { Bucket } from '@/shared/types/bucket.types'

interface UseBucketsState {
  buckets: Bucket[]
  loading: boolean
  error: string | null
}

/**
 * Hook para cargar y gestionar Buckets de un Cycle
 * 
 * Responsabilidades:
 * - Obtener buckets desde Supabase
 * - Filtrar por cycle_id
 * - Ordenar por display_order
 * - Manejar loading
 * - Manejar errores
 * 
 * Uso:
 * const { buckets, loading, error } = useBuckets(cycleId)
 */
export function useBuckets(cycleId: string | undefined) {
  const [state, setState] = useState<UseBucketsState>({
    buckets: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!cycleId) {
      setState({ buckets: [], loading: false, error: 'No cycle ID provided' })
      return
    }

    loadBuckets()
  }, [cycleId])

  const loadBuckets = async () => {
    if (!cycleId) return

    try {
      console.log(`🪣 Loading buckets for cycle: ${cycleId}`)
      setState({ buckets: [], loading: true, error: null })

      const buckets = await BucketService.getCycleBucketsOrdered(cycleId)

      console.log(`✅ Loaded ${buckets.length} buckets`)
      setState({ buckets, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load buckets'
      console.error('❌ Error loading buckets:', errorMessage)
      setState({ buckets: [], loading: false, error: errorMessage })
    }
  }

  return {
    buckets: state.buckets,
    loading: state.loading,
    error: state.error,
    reload: loadBuckets,
  }
}