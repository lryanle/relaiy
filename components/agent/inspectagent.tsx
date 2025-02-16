import { cn } from "@/lib/utils";
import { StateStatus } from "@/types/types";
import { useMemo } from "react";

interface Message {
  role: string;
  content: string;
}

interface AnalysisResult {
  score: number;
  label: string;
}

interface ConversationState {
  modelType: string;
  status: StateStatus;
  messages: Message[];
  score: number;
  analysis?: AnalysisResult[];
}

interface InspectAgentProps {
  states: ConversationState[];
  title?: string;
}

export function InspectAgent({ states, title = "Conversation Evaluation" }: InspectAgentProps) {

  const randomBlue = () => {
    const choices = ["bg-blue-700", "bg-blue-600"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const randomDarkRed = () => {
    const choices = ["bg-red-700", "bg-red-600"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const randomRed = () => {
    const choices = ["bg-amber-600", "bg-amber-500"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const randomYellow = () => {
    const choices = ["bg-yellow-500", "bg-yellow-400"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const randomGreen = () => {
    const choices = ["bg-green-600", "bg-green-500"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const randomGray = () => {
    const choices = ["bg-gray-700/30 dark:bg-gray-300/40", "bg-gray-600/30 dark:bg-gray-300/30"];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  const getStateColor = (status: ConversationState["status"]) => {
    switch (status) {
      case "pending":
        return randomGray();
      default:
        return randomBlue();
    }
  };

  const getMCColor = (status: ConversationState["status"]) => {
    switch (status) {
      case "good":
        return randomGreen();
      case "okay":
        return randomYellow();
      case "bad":
        return randomRed();
      default:
        return randomDarkRed();
    }
  };

  const analysisSection = useMemo(() => {
    if (!states[0]?.analysis) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">ANALYSIS</h3>
        <div className="space-y-1">
          {states[0].analysis.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.score.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [states]);

  return (
    <div className="w-full md:max-w-80 p-6 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-lg">
      {/* Title Section */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-500">{title}</h2>
      </div>

      {/* Analysis Section */}
      {analysisSection}

      {/* State Visualization */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-2">CONVERSATION STATE SPACE</h3>
        <div className="flex flex-row flex-wrap gap-1 w-full max-w-full">
          {states.map((state, index) => (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-full transition-colors",
                getStateColor(state.status)
              )}
              title={`Model: ${state.modelType}, Score: ${state.score.toFixed(2)}`}
            />
          ))}
        </div>
      </div>

      {/* Monte Carlo Section */}
      <div className="mt-8 w-full">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          MONTE CARLO EVALUATION
        </h3>
        <div className="flex flex-row flex-wrap gap-1 w-full max-w-full">
          {states.map((state, index) => (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-full transition-colors",
                getMCColor(state.status)
              )}
              title={`Model: ${state.modelType}, Score: ${state.score.toFixed(2)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
