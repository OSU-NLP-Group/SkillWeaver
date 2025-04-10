// Function metadata type
interface FunctionMetadata {
  version: number;
  status: "update" | "exception_free_test";
  references: string[];
}

// Task consideration data from reasoning
interface TaskConsideration {
  name: string;
  description: string;
  usefulness: number;
  actions: number;
  total: number;
}

// Task selection metadata
interface TaskSelectionMeta {
  task: {
    type: "explore" | "test";
    task: string;
  };
  reasoning: string;
}

// Iteration data type
interface IterationData {
  task: string;
  taskType: "explore" | "test" | "unknown";
  success: number; // 0.0 or 1.0
  functions: {
    [functionName: string]: FunctionMetadata;
  };
  taskSelectionMeta: TaskSelectionMeta | null;
  tasksConsidered?: TaskConsideration[];
}

// Complete knowledge base data type
export interface KnowledgeBaseData {
  max_iterations: number;
  iterations: {
    [iterationKey: string]: IterationData;
  };
}

// Example usage:
// const kbData: KnowledgeBaseData = {...};
