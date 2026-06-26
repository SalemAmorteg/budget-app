import { supabase } from './supabaseClient'

export interface Cycle {
  id: string
  user_id: string
  name: string
  start_date: string
  end_date: string
  income: number
  currency: string
  status: string
  created_at: string
}

export class CycleService {
  static async createCycle(
    userId: string,
    data: {
      name: string
      startDate: string
      endDate: string
      income: number
      currency: string
    }
  ) {
    const { data: cycle, error } = await supabase
      .from('cycles')
      .insert([
        {
          user_id: userId,
          name: data.name,
          start_date: data.startDate,
          end_date: data.endDate,
          income: data.income,
          currency: data.currency,
          status: 'ACTIVE',
        },
      ])
      .select()
      .single()

    if (error) throw error
    return cycle
  }

  static async getUserCycles(userId: string) {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getCycleById(cycleId: string) {
    const { data, error } = await supabase
      .from('cycles')
      .select('*')
      .eq('id', cycleId)
      .single()

    if (error) throw error
    return data
  }

  static async deleteCycle(cycleId: string) {
    const { error } = await supabase
      .from('cycles')
      .delete()
      .eq('id', cycleId)

    if (error) throw error
  }
}