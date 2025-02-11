
export interface NameMatch {
  excelEntry: {
    name: string;
    class: string;
  };
  possibleMatches: Array<{
    name: string;
    class: string;
    _id: string;
  }>;
}

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w\s]/g, '');
}

export function findSimilarNames(
  excelName: string,
  externalStudents: any[]
): NameMatch['possibleMatches'] {
  const normalizedExcelName = normalizeString(excelName);
  
  return externalStudents.filter(student => {
    const normalizedStudentName = normalizeString(student.name);
    // Check if names are similar (contains each other or very similar)
    return normalizedStudentName.includes(normalizedExcelName) ||
           normalizedExcelName.includes(normalizedStudentName) ||
           calculateLevenshteinDistance(normalizedExcelName, normalizedStudentName) <= 3;
  });
}

function calculateLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
