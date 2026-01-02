import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { Leaf, Globe, BarChart3, Upload, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function Navigation({ className, isAuthenticated = false, onLogout }: NavigationProps) {
  const navItems = isAuthenticated ? [
    { to: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { to: "/regions", icon: Globe, label: "Regions" },
    { to: "/import", icon: Upload, label: "Import Data" },
  ] : [];

  return (
    <nav className={cn("flex items-center justify-between p-4 bg-card border-b", className)}>
      <NavLink to="/" className="flex items-center space-x-2">
        <Leaf className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">Carbon Risk Tracker</span>
      </NavLink>

      <div className="flex items-center space-x-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </NavLink>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <NavLink to="/login">Login</NavLink>
            </Button>
            <Button variant="default" asChild>
              <NavLink to="/signup">Sign Up</NavLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}