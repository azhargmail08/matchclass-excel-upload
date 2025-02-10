
import { MatchResult, Student } from "@/types";

export const sortMatchesByFirstName = (matches: MatchResult[]): MatchResult[] => {
  return matches.map(match => ({
    ...match,
    matches: [...match.matches].sort((a, b) => {
      const aFirstName = a.name.split(' ')[0].toLowerCase();
      const bFirstName = b.name.split(' ')[0].toLowerCase();
      const excelFirstName = match.excelRow.name.split(' ')[0].toLowerCase();
      
      if (aFirstName === excelFirstName && bFirstName !== excelFirstName) return -1;
      if (bFirstName === excelFirstName && aFirstName !== excelFirstName) return 1;
      
      return 0;
    })
  }));
};

export const createInitialSelectedMatches = (sortedMatches: MatchResult[]): MatchResult[] => {
  return sortedMatches.map(match => ({
    ...match,
    selected: match.matches.length > 0 ? match.matches[0] : undefined
  }));
};
