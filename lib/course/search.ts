import type { CourseTool } from "@/lib/course/catalog";

export type CourseToolSearchField = "summary" | "tags" | "title" | "topic";

export type CourseToolSearchResult = {
  matchedFields: readonly CourseToolSearchField[];
  score: number;
  tool: CourseTool;
};

const FIELD_WEIGHTS: Record<CourseToolSearchField, number> = {
  title: 80,
  topic: 50,
  tags: 40,
  summary: 15,
};

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[-_/]+/g, " ")
    .replaceAll(/[^\da-z\s]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

const getQueryTokens = (query: string) =>
  normalizeSearchText(query).split(" ").filter(Boolean);

const getSearchableFields = (tool: CourseTool) =>
  ({
    summary: normalizeSearchText(tool.summary),
    tags: normalizeSearchText(tool.tags.join(" ")),
    title: normalizeSearchText(tool.title),
    topic: normalizeSearchText(tool.topic),
  }) satisfies Record<CourseToolSearchField, string>;

const getFieldScore = ({
  fieldValue,
  token,
  weight,
}: {
  fieldValue: string;
  token: string;
  weight: number;
}) => {
  if (!fieldValue.includes(token)) {
    return 0;
  }

  if (fieldValue === token) {
    return weight + 10;
  }

  if (fieldValue.startsWith(token) || fieldValue.includes(` ${token}`)) {
    return weight + 5;
  }

  return weight;
};

export function searchCourseTools(
  query: string,
  tools: readonly CourseTool[],
  limit = 8,
): CourseToolSearchResult[] {
  const tokens = getQueryTokens(query);

  if (tokens.length === 0 || limit <= 0) {
    return [];
  }

  return tools
    .map((tool, index) => {
      const fields = getSearchableFields(tool);
      const matchedFields = new Set<CourseToolSearchField>();
      let score = 0;

      for (const token of tokens) {
        let tokenMatched = false;

        for (const field of Object.keys(fields) as CourseToolSearchField[]) {
          const fieldScore = getFieldScore({
            fieldValue: fields[field],
            token,
            weight: FIELD_WEIGHTS[field],
          });

          if (fieldScore > 0) {
            matchedFields.add(field);
            score += fieldScore;
            tokenMatched = true;
          }
        }

        if (!tokenMatched) {
          return null;
        }
      }

      return {
        index,
        result: {
          matchedFields: [...matchedFields],
          score,
          tool,
        } satisfies CourseToolSearchResult,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((first, second) => {
      if (second.result.score !== first.result.score) {
        return second.result.score - first.result.score;
      }

      return first.index - second.index;
    })
    .slice(0, limit)
    .map((entry) => entry.result);
}
