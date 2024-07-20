
import { api, HydrateClient } from "@/trpc/server";
import VerifyPage from "@/app/_components/verify";


export default async function Verify() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const products = await api.product.getAll({ skip : 0, take : 6});
  void api.post.getLatest.prefetch();
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center  text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div>
        
        <VerifyPage />
    </div>
        </div>
      </main>
    </HydrateClient> );
}
