import { ReactNode } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const isLoginPage = location === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isLoginPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Layout;
