import { Categories } from "@/components/editorial/Categories";
import { GoldPriceChart } from "@/components/editorial/GoldPriceChart";
import { Hero } from "@/components/editorial/Hero"

export default function Home() {
  return (
    <main>
      <Hero /> 
      {/* <GoldPriceChart /> */}
      <Categories />
    </main>
  );
}