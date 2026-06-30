import { supabase } from './supabaseClient'
import {
  Bucket,
  CreateBucketInput,
  UpdateBucketInput,
  BucketType,
  DefaultBucketName,
  DEFAULT_BUCKETS_CONFIG,
} from '../types/bucket.types'

/**
 * BucketService
 * Maneja toda la lógica de negocio relacionada con Buckets
 */
export class BucketService {
  /**
   * Crear un bucket individual
   */
  static async createBucket(input: CreateBucketInput): Promise<Bucket> {
    const { data, error } = await supabase
      .from('buckets')
      .insert([
        {
          cycle_id: input.cycleId,
          name: input.name,
          percentage: input.percentage ?? 0,
          allocated_amount: 0,
          type: input.type ?? BucketType.DEFAULT,
          color: input.color,
          is_default: input.isDefault ?? false,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create bucket: ${error.message}`)
    }

    if (!data) {
      throw new Error('No data returned from bucket creation')
    }

    return this.mapBucketFromDB(data)
  }

  /**
   * Crear los cinco buckets por defecto para un nuevo Cycle
   * Se llama automáticamente cuando se crea un Cycle
   * 
   * Crea:
   * - Necesidades (40%)
   * - Estabilidad (15%)
   * - Inversión (25%)
   * - Recompensas (10%)
   * - Deudas (10%)
   */
  static async createDefaultBuckets(cycleId: string): Promise<Bucket[]> {
    console.log(`📦 Creating default buckets for cycle: ${cycleId}`)

    const defaultBucketNames = Object.values(DefaultBucketName)
    const bucketsToCreate = defaultBucketNames.map((name) => {
      const config = DEFAULT_BUCKETS_CONFIG[name]
      return {
        cycle_id: cycleId,
        name: config.name,
        percentage: 0, // Start with 0, user will allocate
        allocated_amount: 0,
        type: BucketType.DEFAULT,
        color: config.color,
        is_default: true,
      }
    })

    try {
      const { data, error } = await supabase
        .from('buckets')
        .insert(bucketsToCreate)
        .select()

      if (error) {
        throw new Error(`Failed to create default buckets: ${error.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error('No buckets were created')
      }

      console.log(`✅ Created ${data.length} default buckets`)
      return data.map(b => this.mapBucketFromDB(b))
    } catch (error) {
      console.error('❌ Error creating default buckets:', error)
      throw error
    }
  }

  /**
   * Obtener todos los buckets de un ciclo
   */
  static async getCycleBuckets(cycleId: string): Promise<Bucket[]> {
    const { data, error } = await supabase
      .from('buckets')
      .select('*')
      .eq('cycle_id', cycleId)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch buckets: ${error.message}`)
    }

    return (data || []).map(b => this.mapBucketFromDB(b))
  }

  /**
   * Obtener bucket por ID
   */
  static async getBucketById(bucketId: string): Promise<Bucket> {
    const { data, error } = await supabase
      .from('buckets')
      .select('*')
      .eq('id', bucketId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch bucket: ${error.message}`)
    }

    if (!data) {
      throw new Error('Bucket not found')
    }

    return this.mapBucketFromDB(data)
  }

  /**
   * Actualizar bucket
   */
  static async updateBucket(bucketId: string, input: UpdateBucketInput): Promise<Bucket> {
    const updates: Record<string, any> = {}

    if (input.name !== undefined) updates.name = input.name
    if (input.percentage !== undefined) updates.percentage = input.percentage
    if (input.color !== undefined) updates.color = input.color

    const { data, error } = await supabase
      .from('buckets')
      .update(updates)
      .eq('id', bucketId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update bucket: ${error.message}`)
    }

    if (!data) {
      throw new Error('Failed to update bucket')
    }

    return this.mapBucketFromDB(data)
  }

  /**
   * Eliminar bucket
   */
  static async deleteBucket(bucketId: string): Promise<void> {
    const { error } = await supabase
      .from('buckets')
      .delete()
      .eq('id', bucketId)

    if (error) {
      throw new Error(`Failed to delete bucket: ${error.message}`)
    }
  }

  /**
   * Obtener buckets por defecto de un ciclo
   */
  static async getDefaultBuckets(cycleId: string): Promise<Bucket[]> {
    const { data, error } = await supabase
      .from('buckets')
      .select('*')
      .eq('cycle_id', cycleId)
      .eq('is_default', true)
      .order('created_at', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch default buckets: ${error.message}`)
    }

    return (data || []).map(b => this.mapBucketFromDB(b))
  }

  /**
   * Mapear datos de BD al modelo Bucket
   */
  private static mapBucketFromDB(data: any): Bucket {
    return {
      id: data.id,
      cycleId: data.cycle_id,
      name: data.name,
      percentage: data.percentage,
      allocatedAmount: data.allocated_amount,
      type: data.type as BucketType,
      color: data.color,
      isDefault: data.is_default,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  /**
 * Obtener todos los buckets de un ciclo ordenados por display_order
 * Se utiliza en Distribution Planner para mostrar la lista de cajas
 */
static async getCycleBucketsOrdered(cycleId: string): Promise<Bucket[]> {
  console.log(`📦 Fetching buckets for cycle: ${cycleId}`)
  
  const { data, error } = await supabase
    .from('buckets')
    .select('*')
    .eq('cycle_id', cycleId)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch buckets:', error)
    throw new Error(`Failed to fetch buckets: ${error.message}`)
  }

  if (!data) {
    console.log('⚠️ No buckets found for cycle')
    return []
  }

  console.log(`✅ Fetched ${data.length} buckets`)
  return data.map(b => this.mapBucketFromDB(b))
}

/**
 * Obtener buckets por defecto de un ciclo, ordenados
 */
static async getDefaultBucketsOrdered(cycleId: string): Promise<Bucket[]> {
  const { data, error } = await supabase
    .from('buckets')
    .select('*')
    .eq('cycle_id', cycleId)
    .eq('is_default', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch default buckets: ${error.message}`)
  }

  return (data || []).map(b => this.mapBucketFromDB(b))
}

}