export const calculateCreditScore = (data: any) => {
    let score = 710; // Start at max score
  
    // Payment History (35%)
    score -= data.missedPayments * 30;
    score -= data.latePayments * 15;
    score -= data.defaultedLoans * 50;
  
    // Credit Utilization (30%)
    if (data.creditUtilization > 30) score -= (data.creditUtilization - 30) * 2;
    if (data.creditUtilization > 50) score -= 20;
  
    // Credit Age (15%)
    if (data.oldestAccountAge < 5) score -= (5 - data.oldestAccountAge) * 5;
  
    // Credit Mix (10%)
    if (data.creditAccounts < 2) score -= 20;
  
    // New Credit Applications (10%)
    if (data.recentInquiries > 2) score -= (data.recentInquiries - 2) * 10;
  
    return Math.max(0, score); // Ensure score doesn't go below 0
  };
  