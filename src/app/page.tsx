import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Market } from "@/components/Market";
import { Benchmark } from "@/components/Benchmark";
import { WhoHasWhat } from "@/components/WhoHasWhat";
import { FieldTwin } from "@/components/FieldTwin";
import { SponsorSpots } from "@/components/SponsorSpots";
import { HiddenData } from "@/components/HiddenData";
import { EvoKnowledge } from "@/components/EvoKnowledge";
import { Demo } from "@/components/Demo";
import { Ecosystem } from "@/components/Ecosystem";
import { Horizons } from "@/components/Horizons";
import { Plan } from "@/components/Plan";
import { Gaps, Sources } from "@/components/Gaps";
import { ActBanner } from "@/components/ActBanner";
import { RevealObserver } from "@/components/ui";

// Recorrido en tres actos: contexto → solución → cómo lo hacemos.
export default function Home() {
  return (
    <>
      <Nav />
      <RevealObserver />
      <main>
        <Hero />
        <ActBanner n={1} />
        <Market />
        <Benchmark />
        <WhoHasWhat />
        <ActBanner n={2} />
        <Demo />
        <FieldTwin />
        <SponsorSpots />
        <HiddenData />
        <ActBanner n={3} />
        <EvoKnowledge />
        <Ecosystem />
        <Horizons />
        <Plan />
        <Gaps />
      </main>
      <Sources />
    </>
  );
}
