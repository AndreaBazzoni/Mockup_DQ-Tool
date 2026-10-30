import DataQualityApp from "@/DataQualityApp";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/Footer";

export default function App() {
  return (
    <>
      <DataQualityApp />
      <Toaster
        // I add the X
        closeButton
        // Disappear after 5000ms (default = 4000)
        duration={5000}
      />
      <Footer />
    </>
  );
}