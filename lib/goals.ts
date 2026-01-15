export type LearningGoal =
  | "coding"
  | "dsa"
  | "web"
  | "ai";

export const GOAL_QUERY_MAP: Record<LearningGoal, string> = {
  coding: "programming tutorial",
  dsa: "data structures and algorithms tutorial",
  web: "web development tutorial",
  ai: "artificial intelligence tutorial",
};
