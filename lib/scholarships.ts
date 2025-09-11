// Scholarship-Amount mapping for automatic amount filling
export const SCHOLARSHIP_AMOUNTS: Record<string, string> = {
  "SIKAP Grant Scholarship": "5000",
  "Academic Excellence Scholarship": "50000",
  "STEM Innovation Grant": "7500", 
  "Research Grant Scholarship": "25000",
  "Dean's Merit Award": "15000",
  "Full Academic Merit Scholarship": "75000",
  "Community Service Scholarship": "10000",
  "Leadership Development Grant": "20000",
  "First Generation College Student Grant": "12000",
  "Athletic Excellence Award": "8000"
};

// Helper function to get amount for a specific scholarship
export function getAmountForScholarship(scholarshipName: string): string {
  return SCHOLARSHIP_AMOUNTS[scholarshipName] || "";
}

// Helper function to format amount with peso sign
export function formatAmount(amount: string): string {
  if (!amount) return "";
  const numericAmount = parseFloat(amount);
  return `₱${numericAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper function to get all available scholarships with amounts
export function getScholarshipOptions(): Array<{ name: string; amount: string; formattedAmount: string }> {
  return Object.entries(SCHOLARSHIP_AMOUNTS).map(([name, amount]) => ({
    name,
    amount,
    formattedAmount: formatAmount(amount)
  }));
}

// Helper function to validate if scholarship exists
export function isValidScholarship(scholarshipName: string): boolean {
  return scholarshipName in SCHOLARSHIP_AMOUNTS;
}