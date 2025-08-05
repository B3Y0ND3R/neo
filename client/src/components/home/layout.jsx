import Header from "@/components/home/header";
import Footer from "@/components/home/footer";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;



