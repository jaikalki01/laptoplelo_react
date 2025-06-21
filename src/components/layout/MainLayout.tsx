
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ScrollArea className="h-full w-full">{children}</ScrollArea>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
