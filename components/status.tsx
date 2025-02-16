import { Status as StatusType } from "@/types/types";
type Size = "xs" | "sm" | "md" | "lg";

interface StatusProps {
  status: StatusType;
  size?: Size;
  speed?: number;
}

export default function Status({ status, size = "sm", speed = 5000 }: Readonly<StatusProps>) {

  const statusColor = (status: StatusType) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-amber-500";
      case "Complete":
        return "bg-slate-500";
    }
  };

  const statusSize = (size: Size) => {
    switch (size) {
      case "xs":
        return "size-2";
      case "sm":
        return "size-3";
      case "md":
        return "size-4";
      case "lg":
        return "size-5";
    }
  };

  return (
    <span className={`relative flex ${statusSize(size)}`}>
      <span style={{ animationDelay: `${speed}ms` }} className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusColor(status)} opacity-75`}></span>
      <span className={`relative inline-flex ${statusSize(size)} rounded-full ${statusColor(status)}`}></span>
    </span>
  );
}
