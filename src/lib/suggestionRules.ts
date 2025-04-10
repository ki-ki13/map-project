export interface BusinessSuggestion {
  type: string;
  count: number;
  suggestion: string;
}

const thresholds: Record<string, { low: number; high: number }> = {
  default: { low: 2, high: 5 },

  cafe: { low: 3, high: 7 },
  restaurant: { low: 5, high: 10 },
  pub: { low: 2, high: 5 },
  bar: { low: 2, high: 5 },
  supermarket: { low: 1, high: 3 },
  bakery: { low: 1, high: 3 },
  pharmacy: { low: 1, high: 2 },
  clothes: { low: 3, high: 7 },
  hairdresser: { low: 2, high: 4 },
  hotel: { low: 2, high: 5 },
};

export function generateSuggestions(
  businessTypes: Record<string, number>
): BusinessSuggestion[] {
  const suggestions: BusinessSuggestion[] = [];

  for (const [type, count] of Object.entries(businessTypes)) {
    const { low, high } = thresholds[type] || thresholds.default;

    let suggestion = "";
    if (count === 0) {
      suggestion = "No competition - excellent opportunity!";
    } else if (count < low) {
      suggestion = "Low competition - good opportunity";
    } else if (count < high) {
      suggestion = "Moderate competition - consider carefully";
    } else {
      suggestion = "High competition - market may be saturated";
    }

    suggestions.push({ type, count, suggestion });
  }

  return suggestions.sort((a, b) => {
    if (a.count === 0 && b.count > 0) return -1;
    if (b.count === 0 && a.count > 0) return 1;

    const aThreshold = thresholds[a.type] || thresholds.default;
    const bThreshold = thresholds[b.type] || thresholds.default;

    const aRatio = a.count / aThreshold.high;
    const bRatio = b.count / bThreshold.high;

    return aRatio - bRatio;
  });
}
