import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
      <main className="flex flex-col min-h-screen">
        <Banner />
        {/* <PromoteCard /> */}
        <Footer />
      </main>
  );
}
