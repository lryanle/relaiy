import { Home, ChartArea, Wallet, Settings2, Settings, Info } from "lucide-react";
import { Route } from "@/types/types";
export const groups = [
  "Overview", "Modifications"
]

export const routes: Route[] = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/",
    group: "Overview",
  },
  {
    name: "Analytics",
    icon: ChartArea,
    href: "/analytics",
    group: "Overview",
  },
  {
    name: "Usage",
    icon: Wallet,
    href: "/usage",
    group: "Overview",
  },
  {
    name: "Fine-tuning",
    icon: Settings2,
    href: "/finetuning",
    group: "Modifications",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
    group: "Settings",
  },
  {
    name: "Info",
    icon: Info,
    href: "/info",
    group: "Settings",
  }
]