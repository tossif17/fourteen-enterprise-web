import { useParams, Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { products } from "@/data/products";

const ProductDetail = () => {
  const { productId } = useParams();
  const product = products.find((p) => p.id === Number(productId));

  if (!product) return <div className="p-10 text-center text-muted-foreground">Product not found</div>;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6">
        <section className="w-full px-6">
          {/* Mobile breadcrumb */}
          <div className="lg:hidden mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to="/shop">{product.category}</Link></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery images={galleryImages} />

            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
              <ProductInfo product={product} />
              <ProductDescription product={product} />
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">More {product.category}</h2>
          </div>
          <ProductCarousel currentProduct={product} mode="same-category" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;