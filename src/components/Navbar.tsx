import { useLanguage } from "@/context/LanguageContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Shield,
  MessageCircle,
  AlertTriangle,
  FileText,
  Phone,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const goToSection = (id: string) => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const navItems = [
    {
      label: language === "en" ? "Home" : "होम",
      to: "/",
      icon: Home,
    },
    {
      label: language === "en" ? "Detector" : "डिटेक्टर",
      to: "/detector",
      icon: Shield,
    },
    {
      label: language === "en" ? "Forum" : "फोरम",
      to: "/forum",
      icon: MessageCircle,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img
            src="/logo.png"
            alt="Phishing Guard logo"
            className="h-10 w-10 rounded-lg object-contain shadow-lg"
          />
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Phishing Guard
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to === location.pathname;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => goToSection("prevention")}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === "en" ? "Prevention" : "बचाव"}
            </span>
          </button>

          <button
            onClick={() => goToSection("examples")}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === "en" ? "Examples" : "उदाहरण"}
            </span>
          </button>

          <button
            onClick={() => goToSection("contact")}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === "en" ? "Contact" : "संपर्क"}
            </span>
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3 py-2 rounded-md text-sm font-medium border hover:bg-accent hover:text-accent-foreground transition"
          >
            {language === "en" ? "हिंदी" : "EN"}
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}