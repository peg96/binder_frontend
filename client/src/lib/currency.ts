/**
 * Formatta un importo numerico in Euro (€)
 */
export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}
