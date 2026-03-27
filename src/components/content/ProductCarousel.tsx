import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { products as allProducts } from "@/data/products";

const featuredProducts = allProducts.filter(p => p.isNew).slice(0, 6);

const ProductCarousel = () => {
  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent>
          {featuredProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/30 relative flex items-center justify-center transition-all duration-300 group-hover:bg-accent/60 group-hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="text-center p-4 relative z-10 transition-transform duration-300 group-hover:scale-110">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-8 h-8 text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                          </svg>
                        </div>
                        <p className="text-xs text-muted-foreground font-light">{product.category}</p>
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-foreground text-background">
                        NEW
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-light text-muted-foreground">{product.brand}</p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm font-light text-foreground">{product.priceFormatted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
