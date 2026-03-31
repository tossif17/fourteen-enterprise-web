import Header from "../components/header/Header";
import LargeHero from "../components/content/LargeHero";
import BrandProfile from "../components/Crousle/BrandProfile"
import ContactAnimated from "@/components/ContactAnimated/ContactAnimated";
import CardDefault from "@/components/CardItem/CardDefault";
import FeatureProducts from "@/components/FeatureProducts/FeatureProducts";
import Footer from "@/components/footer/Footer";
import ShoeGrid from "@/components/grid/ShoeGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="">
        {/* <FiftyFiftySection />
        <ProductCarousel /> */}
        <LargeHero />

        <BrandProfile/>
        <FeatureProducts/>
        <ShoeGrid/>
        <CardDefault/>
        <ContactAnimated/>
        <Footer/>
        {/* <OneThirdTwoThirdsSection /> */}
        {/* 
        <EditorialSection /> */}
      </main>
      
    </div>
  );
};

export default Index;
