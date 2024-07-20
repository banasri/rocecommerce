
import { api, HydrateClient } from "@/trpc/server";
import { ProductCategory } from "../_components/product";


async function Product() {
  
 
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div>
       
        <ProductCategory />
    </div>
        </div>
      </main>
    </HydrateClient>
  );
}


export default Product;
