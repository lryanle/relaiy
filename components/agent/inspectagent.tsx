import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatReceipientId, getProviderIconFromModel } from "@/lib/utils";
import { Conversation, StateStatus } from "@/types/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface Message {
  role: string;
  content: string;
}

interface AnalysisResult {
  score: number;
  label: string;
}

export interface ConversationState {
  modelType: string;
  status: StateStatus;
  messages: Message[];
  score: number;
  analysis?: AnalysisResult[];
}

interface InspectAgentProps {
  states: ConversationState[];
  title?: string;
  selectedConvo: Conversation;
  setSelectedConvo?: (convo: Conversation | null) => void;
}

export function InspectAgent({ selectedConvo, states, title = "Conversation Evaluation", setSelectedConvo }: InspectAgentProps) {

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
      case "best":
        return randomBlue();
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

  const threshold = useMemo(() => {
    if (!states.length) return 0;
    const topStates = [...states].sort((a, b) => b.score - a.score);
    return topStates[Math.floor(topStates.length * 0.3)]?.score ?? 0;
  }, [states]);

  const analysisSection = useMemo(() => {
    if (!states.length) return null;
    
    const topStates = [...states].sort((a, b) => b.score - a.score);
    
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">RESPONSE ANALYSIS</h3>
        <div className="space-y-1 max-h-20 overflow-y-auto">
          {topStates.map((state, index) => (
            <div key={index} className="flex items-start justify-start gap-2">
              <span className={cn(
                "px-5 text-sm font-medium rounded-md p-1",
                state.score >= threshold && state.score > 0
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              )}>
                {state.score.toFixed(2)}
              </span>
              <span className="w-full text-sm text-gray-700 dark:text-gray-300">
                {state.messages.length > 0 && state.messages[state.messages.length - 1].content}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [states]);

  return (
    <div className="w-full md:max-w-80 p-4 pt-3 bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23] rounded-lg relative">
      
      {setSelectedConvo && (
        <Button variant="destructive" size="icon" className="absolute top-3 right-3 w-8 h-8" onClick={() => setSelectedConvo(null)}>
          <X className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      )}

      {/* Title Section */}
      <div className="mb-3">
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      </div>

      {selectedConvo && (
        <div className="mb-2 bg-gray-100 dark:bg-[#1F1F23] rounded-lg p-2 space-y-0.5">
          <span className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">SELECTED GOAL</h2>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatReceipientId(selectedConvo.recipient, selectedConvo.channel)}
            </span>
          </span>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">"{selectedConvo.goal}"</h3>
        </div>
      )}

      <Link href={`/conversation/${selectedConvo?.id}`}>
        <Button variant="secondary" size="sm" className="w-full" >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Full Conversation</span>
        </Button>
      </Link>

      <Separator className="my-4" />

      {/* Analysis Section */}
      {analysisSection}

      {/* State Visualization */}
      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">CONVERSATION STATE SPACE</h3>
        <div className="flex flex-row flex-wrap gap-1 w-full max-w-full">
          {states.map((state, index) => (
            <TooltipProvider key={index + "tooltip" + state.modelType + state.status + state.score}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-colors",
                      getStateColor(state.status)
                    )}
                    title={`Model: ${state.modelType}, Score: ${state.score.toFixed(2)}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                <div className="flex justify-center items-start gap-2">
                    <Avatar className="bg-gray-100 dark:bg-gray-600 rounded-sm">
                      <AvatarImage src={getProviderIconFromModel(state.modelType)} alt={state.modelType} />
                    </Avatar>
                    <span className="flex flex-col justify-center items-start gap-0.5 max-w-[200px]">
                      <span className="flex flex-row justify-center items-center gap-2">
                        <Badge variant="outline" className={`text-sm px-1 py-0.5 leading-none font-medium rounded-sm ${state.status === "pending" ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" : "bg-blue-500 text-white border-blue-800 dark:bg-blue-800"}`}>
                          {state.status === "pending" ? "Unexplored" : "Explored"}
                        </Badge>
                        <span className="text-sm font-medium">
                          {state.modelType}
                        </span>
                      </span>
                      <span className="text-sm font-medium dark:text-gray-700 text-gray-300">
                        {state.messages[state.messages.length - 1].content}
                      </span>
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Monte Carlo Section */}
      <div className="mt-5 w-full">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          MONTE CARLO EVALUATION
        </h3>
        <div className="flex flex-row flex-wrap gap-1 w-full max-w-full">
          {states.map((state, index) => (
            <TooltipProvider key={index + "tooltip" + state.modelType + state.status + state.score}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full transition-colors",
                      getMCColor(state.status)
                    )}
                    title={`Model: ${state.modelType}, Score: ${state.score.toFixed(2)}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                <div className="flex justify-center items-start gap-2">
                    <span className="flex flex-col justify-center items-center gap-1">
                      <Avatar className="bg-gray-100 dark:bg-gray-600 rounded-sm">
                        <AvatarImage src={getProviderIconFromModel(state.modelType)} alt={state.modelType} />
                      </Avatar>
                      <Badge variant="outline" className={cn(
                        "text-sm px-1 py-0.5 leading-none font-medium rounded-sm",
                        state.score >= threshold && state.score > 0
                          ? "bg-blue-500 text-white border-blue-800" 
                          : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800"
                      )}>
                        {state.score.toFixed(2)}
                      </Badge>
                    </span>
                    <span className="flex flex-col justify-center items-start gap-0.5 max-w-[300px]">
                      <span className="flex flex-row justify-center items-center gap-2">
                        <span className="text-sm font-medium">
                          {state.modelType}
                        </span>
                      </span>
                      <span className="text-sm font-medium dark:text-gray-700 text-gray-300">
                        {state.messages[state.messages.length - 1].content}
                      </span>
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
