import { Link } from "wouter";
import { Plane } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-2 group-hover:bg-primary-dark transition-colors">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TripGenie</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
