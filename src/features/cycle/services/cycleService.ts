import { supabase } from '@/shared/services/supabaseClient'
import { BucketService } from '@/shared/services/bucketService'

// ========== TYPES ==========
export interface Cycle {
  id: string
  user_id: string
  name: string
  start_date: string
  end_date: string
  income: number
  currency: 'COP' | 'USD' | 'EUR'
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING'
  created_at: string
  updated_at: string
}

export interface CreateCycleInput {
  name: string
  startDate: string
  endDate: string
  income: number
  currency: 'COP' | 'USD' | 'EUR'
}

export interface CycleResponse {
  success: boolean
  data?: Cycle
  error?: string
}

// ========== SERVICE ==========
export class CycleService {
  /**
   * Crear un nuevo ciclo de ingresos
   * - Valida que no haya otro ciclo ACTIVE
   * - Crea el ciclo con status ACTIVE
   * - Retorna el ciclo creado
   */
  static async createCycle(
  userId: string,
  input: CreateCycleInput
): Promise<Cycle> {
  // 1. Validar que el usuario no tenga otro ciclo activo
  const { data: activeCycle, error: activeError } = await supabase
    .from('cycles')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .single()

  // Si hay error pero NO es "no rows", es un error real
  if (activeError && activeError.code !== 'PGRST116') {
    throw new Error(`Failed to check active cycles: ${activeError.message}`)
  }

  // Si ya existe un ciclo activo, marcarlo como COMPLETED
  if (activeCycle) {
    await supabase
      .from('cycles')
      .update({ status: 'COMPLETED' })
      .eq('id', activeCycle.id)
  }

  // 2. Crear el nuevo ciclo
  const { data, error } = await supabase
    .from('cycles')
    .insert([
      {
        user_id: userId,
        name: input.name,
        start_date: input.startDate,
        end_date: input.endDate,
        income: input.income,
        currency: input.currency,
        status: 'ACTIVE',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(`Failed to create cycle: ${error.message}`)
  }

  if (!data) {
    throw new Error('No data returned from cycle creation')
  }

  const cycle = this.mapCycleFromDB(data)
  console.log('✅ Cycle created successfully:', cycle)

  // 3. ⭐ CREAR BUCKETS POR DEFECTO AUTOMÁTICAMENTE
  try {
    const buckets = await BucketService.createDefaultBuckets(cycle.id)
    console.log(`✅ Created ${buckets.length} default buckets for cycle`)
  } catch (bucketError) {
    console.error('⚠️ Warning: Failed to create default buckets:', bucketError)
    // No lanzar error aquí, el ciclo ya fue creado
    // Los buckets se pueden crear después
  }

  return cycle
}

  /**
   * Obtener todos los ciclos del usuario
   */
  static async getUserCycles(userId: string): Promise<Cycle[]> {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch cycles: ${error.message}`)
    }

    return (data || []).map(c => this.mapCycleFromDB(c))
  }

  /**
   * Obtener ciclo activo del usuario
   */
  static async getActiveCycle(userId: string): Promise<Cycle | null> {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .single()

    // PGRST116 = No rows found (es normal)
    if (error?.code === 'PGRST116') {
      return null
    }

    if (error) {
      throw new Error(`Failed to fetch active cycle: ${error.message}`)
    }

    return data ? this.mapCycleFromDB(data) : null
  }

  /**
   * Obtener ciclo por ID
   */
  static async getCycleById(cycleId: string): Promise<Cycle> {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('id', cycleId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch cycle: ${error.message}`)
    }

    if (!data) {
      throw new Error('Cycle not found')
    }

    return this.mapCycleFromDB(data)
  }

  /**
   * Actualizar ciclo
   */
  static async updateCycle(
    cycleId: string,
    updates: Partial<CreateCycleInput>
  ): Promise<Cycle> {
    const payload: Record<string, any> = {}

    if (updates.name) payload.name = updates.name
    if (updates.startDate) payload.start_date = updates.startDate
    if (updates.endDate) payload.end_date = updates.endDate
    if (updates.income) payload.income = updates.income
    if (updates.currency) payload.currency = updates.currency

    const { data, error } = await supabase
      .from('cycles')
      .update(payload)
      .eq('id', cycleId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update cycle: ${error.message}`)
    }

    if (!data) {
      throw new Error('Failed to update cycle')
    }

    return this.mapCycleFromDB(data)
  }

  /**
   * Eliminar ciclo (soft delete, cambiar estado)
   */
  static async deleteCycle(cycleId: string): Promise<void> {
    const { error } = await supabase
      .from('cycles')
      .update({ status: 'COMPLETED' })
      .eq('id', cycleId)

    if (error) {
      throw new Error(`Failed to delete cycle: ${error.message}`)
    }
  }

  /**
   * Mapear datos de BD a modelo Cycle
   */
  private static mapCycleFromDB(data: any): Cycle {
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      income: data.income,
      currency: data.currency,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  }
}