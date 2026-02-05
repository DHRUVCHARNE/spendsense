import {FaGithub,FaGoogle} from "react-icons/fa"
import type { IconType } from "react-icons/lib";
export const appInfo = {
  title: "SpendSense",
  author: "Dhruv Charne",
  description: "Smart personal expense tracking and financial insights.",
  currentYear:2026,
  social: {
    github: "https://github.com/DHRUVCHARNE",
    x: "https://x.com/Dhruv4ne",
    linkedin: "https://www.linkedin.com/in/dhruv-charne-908848213/",
    portfolio: "https://dhruv4ne-portfolio.vercel.app/",
  },
  limitsPerUser:{
    categories:25,
    txns:700,
    amount:5000,
    loginAttempts:10,
    createAttempts:20, // per minute
    updateAttempts:10,
    deleteAttempts:10,
    fetchAttempts:60
  },
  
  authProviders: [
    {
      id: "github",
      label: "GitHub",
      icon: FaGithub, 
      iconColor: "",
    },
    {
      id: "google",
      label: "Google",
      icon: FaGoogle,
      iconColor: "text-red-500",
    },
  ] as {
    id: string
    label: string
    icon: IconType
    iconColor?: string
  }[],
};
