
import { api, HydrateClient } from "@/trpc/server";
import { Register } from "./_components/signup";

export default async function Home() {
  void api.post.getLatest.prefetch();
  
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div>
        
        <Register />
    </div>
        </div>
      </main>
    </HydrateClient>
  );
}
