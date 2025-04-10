import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import sampleData from "./knowledgebasedata.json";
import { KnowledgeBaseData } from "./types";

export default function KnowledgeBaseExplorer() {
  const [currentIteration, setCurrentIteration] = useState(1);
  // @ts-expect-error sampleData has no type annotation
  const [kbData] = useState<KnowledgeBaseData>(sampleData);
  const [loading, setLoading] = useState(false);

  // In a real implementation, this would fetch data from the backend
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    // In a real app, fetch data here
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const maxIteration = kbData.max_iterations;
  const currentIterKey = `iter_${currentIteration}`;
  const currentIterData = kbData.iterations[currentIterKey] || {};
  const currentFunctions = currentIterData.functions || {};

  // Count proposed vs verified functions
  const getFunctionCounts = () => {
    const functions = currentFunctions;
    let proposed = 0;
    let verified = 0;

    Object.keys(functions).forEach((funcName) => {
      if (functions[funcName].status === "update") {
        proposed++;
      } else if (functions[funcName].status === "exception_free_test") {
        verified++;
      }
    });

    return { proposed, verified };
  };

  const { proposed, verified } = getFunctionCounts();

  return (
    <div className="flex flex-col p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Knowledge Base Explorer
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">
            Loading knowledge base data...
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-6">
            <span className="mr-2 text-gray-700 w-32">Iteration:</span>
            <input
              type="range"
              min="1"
              max={maxIteration}
              value={currentIteration}
              onChange={(e) =>
                setCurrentIteration(parseInt(e.target.value) - 1)
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 font-semibold">
              {currentIteration} / {maxIteration}
            </span>
          </div>

          {false && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                Knowledge Base Growth
              </h2>

              {/* Function Count Chart */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Function Count</h3>
                <div className="h-16 flex items-end">
                  {Array.from({ length: maxIteration }).map((_, i) => {
                    const iterKey = `iter_${i}`;
                    const iterFunctions =
                      kbData.iterations[iterKey]?.functions || {};
                    const functionCount = Object.keys(iterFunctions).length;
                    const height =
                      functionCount > 0 ? (functionCount / 10) * 100 : 5;

                    return (
                      <div
                        key={i}
                        className={`relative mx-1 rounded-t-sm ${
                          i + 1 <= currentIteration
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        style={{
                          height: `${Math.min(height, 100)}%`,
                          width: `${100 / maxIteration - 2}%`,
                          minHeight: "4px",
                        }}
                      >
                        {i + 1 === currentIteration && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-700 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>1</span>
                  <span>{maxIteration}</span>
                </div>
              </div>

              {/* Iteration Type Indicators */}
              <div>
                <h3 className="text-md font-medium mb-2">Iteration Types</h3>
                <div className="flex">
                  {Array.from({ length: maxIteration }).map((_, i) => {
                    const iterKey = `iter_${i}`;
                    const iterType =
                      kbData.iterations[iterKey]?.taskType || "unknown";

                    let bgColor = "bg-gray-300";
                    if (iterType === "explore") bgColor = "bg-blue-500";
                    if (iterType === "test") bgColor = "bg-purple-500";

                    return (
                      <div
                        key={i}
                        className={`${bgColor} mx-1 h-8 rounded-sm ${
                          i + 1 === currentIteration ? "ring-2 ring-black" : ""
                        }`}
                        style={{
                          width: `${100 / maxIteration - 2}%`,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Explore</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Test</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">Current Task</h2>
                <p className="text-gray-700">
                  {currentIterData.task || "No task available"}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentIterData.taskType === "explore"
                      ? "bg-blue-100 text-blue-800"
                      : currentIterData.taskType === "test"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentIterData.taskType === "explore"
                    ? "Explore"
                    : currentIterData.taskType === "test"
                    ? "Test"
                    : "Unknown"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentIterData.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentIterData.success ? "Success" : "Failure"}
                </span>
              </div>
            </div>
          </div>

          {/* Task Selection (for explore iterations) */}
          {currentIterData.taskType === "explore" &&
            currentIterData.tasksConsidered && (
              <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Task Selection</h2>
                <div className="space-y-4">
                  {currentIterData.tasksConsidered.map((taskInfo, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        taskInfo.name === currentIterData.task
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">
                          {taskInfo.name}
                          {taskInfo.name === currentIterData.task && (
                            <span className="ml-2 text-blue-600 text-sm">
                              (Selected)
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        {/* @ts-expect-error 'Markdown cannot be used as a component' is a false positive error. */}
                        <Markdown children={taskInfo.description} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Proposed APIs
              </h3>
              <p className="text-3xl font-bold text-blue-600">{proposed}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Verified APIs
              </h3>
              <p className="text-3xl font-bold text-green-600">{verified}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Functions</h2>
            {Object.keys(currentFunctions).length > 0 ? (
              <div className="space-y-3">
                {Object.keys(currentFunctions).map((funcName) => (
                  <div
                    key={funcName}
                    className={`border-l-4 pl-4 py-2 rounded-r-lg flex justify-between items-center ${
                      currentFunctions[funcName].status ===
                      "exception_free_test"
                        ? "border-green-500 bg-green-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium text-gray-800">{funcName}</h3>
                      <p className="text-sm text-gray-600">
                        Version: {currentFunctions[funcName].version} •
                        Referenced in:{" "}
                        {currentFunctions[funcName].references.join(", ")}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          currentFunctions[funcName].status ===
                          "exception_free_test"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {currentFunctions[funcName].status ===
                        "exception_free_test"
                          ? "Verified"
                          : "Proposed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No functions available for this iteration
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
