import DataQualityApp from "@/DataQualityApp";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/Footer";

export default function App() {
  return (
    <>
      <DataQualityApp />
      <Toaster
        // Aggiungo la X
        closeButton
        // Scomparsa dopo 3000ms (default = 4000)
        duration={3000}
      />
      <Footer />
    </>
  );
}