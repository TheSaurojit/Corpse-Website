import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PinSection from "@/components/PinSection";
import TextImageReveal from "@/components/TextImageReveal";
import SpotlightSection from "@/components/SpotlightSection";
import Text from "@/components/Text";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <Navbar />
      <HeroSection />

      {/* <TextImageReveal className="my-[10vh]" /> */}

      <SpotlightSection />

      <PinSection className="z-[999]" />
    </main>
  );
}
