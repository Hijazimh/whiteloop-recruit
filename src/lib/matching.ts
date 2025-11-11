export type Rule =
  | {
      field: string;
      op:
        | "in"
        | "includesAny"
        | "includes"
        | "gte"
        | "lte"
        | "eq"
        | "neq";
      target: unknown;
      weight: number;
      must?: boolean;
    };

export type Criteria = {
  threshold: number;
  rules: Rule[];
};

function getValue(
  path: string,
  profile: unknown,
  answers: unknown
): unknown {
  const isAnswers = path.startsWith("answers.");
  const source: unknown = isAnswers ? answers : profile;
  const keyPath = isAnswers ? path.replace(/^answers\./, "") : path;
  const parts = keyPath.split(".").filter(Boolean);

  let current: unknown = source;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    const obj = current as Record<string, unknown>;
    current = obj[p];
  }
  return current;
}

function evaluate(op: Rule["op"], value: unknown, target: unknown): boolean {
  switch (op) {
    case "in":
      return Array.isArray(target) && target.includes(value as never);
    case "includesAny":
      return (
        Array.isArray(value) &&
        Array.isArray(target) &&
        value.some((v) => (target as unknown[]).includes(v))
      );
    case "includes":
      return Array.isArray(value) ? value.includes(target as never) : false;
    case "gte":
      return Number(value) >= Number(target);
    case "lte":
      return Number(value) <= Number(target);
    case "eq":
      return value === target;
    case "neq":
      return value !== target;
    default:
      return false;
  }
}

export function scoreApplicant(
  criteria: Criteria,
  profile: unknown,
  answers: unknown
) {
  let score = 0;
  for (const rule of criteria.rules) {
    const value = getValue(rule.field, profile, answers);
    const passed = evaluate(rule.op, value, rule.target);
    score += passed ? rule.weight : 0;
    if (rule.must && !passed) {
      return { score: 0, decision: "reject" as const };
    }
  }
  return {
    score,
    decision: score >= criteria.threshold ? ("approve" as const) : ("manual" as const),
  };
}

