import { Categories } from "@/components/editorial/Categories";
import { GoldPriceChart } from "@/components/editorial/GoldPriceChart";
import { Hero } from "@/components/editorial/Hero"
import { AboutTeaser } from "@/components/editorial/AboutTeaser";

export default function Home() {
  return (
    <main>
      <Hero /> 
      <GoldPriceChart />
      <Categories />
      <AboutTeaser />
    </main>
  );
}