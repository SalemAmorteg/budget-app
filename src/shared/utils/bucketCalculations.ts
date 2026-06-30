/**
 * Utilidades para cálculos financieros relacionados con Buckets
 * Lógica pura, sin dependencias de estado
 */

/**
 * Calcular el monto asignado a un bucket
 * 
 * Formula: allocatedAmount = income × percentage / 100
 * 
 * @param income - Ingreso total del ciclo
 * @param percentage - Porcentaje asignado al bucket (0-100)
 * @returns Monto asignado
 * 
 * Ejemplo:
 * calculateAllocatedAmount(4000000, 40) = 1600000
 */
export function calculateAllocatedAmount(income: number, percentage: number): number {
  if (income < 0 || percentage < 0) {
    return 0
  }
  
  const allocated = (income * percentage) / 100
  
  // Redondear a 2 decimales para evitar errores de precisión
  return Math.round(allocated * 100) / 100
}

/**
 * Calcular el porcentaje total asignado
 * 
 * @param percentages - Array de porcentajes
 * @returns Suma de porcentajes
 */
export function calculateTotalPercentage(percentages: number[]): number {
  const total = percentages.reduce((sum, p) => sum + p, 0)
  // Redondear a 1 decimal
  return Math.round(total * 10) / 10
}

/**
 * Calcular el monto total asignado
 * 
 * @param amounts - Array de montos asignados
 * @returns Suma de montos
 */
export function calculateTotalAmount(amounts: number[]): number {
  const total = amounts.reduce((sum, a) => sum + a, 0)
  // Redondear a 2 decimales
  return Math.round(total * 100) / 100
}

/**
 * Validar que un porcentaje esté en el rango válido
 * 
 * @param percentage - Porcentaje a validar
 * @returns Porcentaje clampeado entre 0 y 100
 */
export function clampPercentage(percentage: number): number {
  return Math.max(0, Math.min(100, percentage))
}

/**
 * Parsear y validar input de porcentaje
 * 
 * @param input - String del input
 * @returns Número válido o 0
 */
export function parsePercentageInput(input: string): number {
  const parsed = parseFloat(input)
  
  if (isNaN(parsed)) {
    return 0
  }
  
  return clampPercentage(parsed)
}