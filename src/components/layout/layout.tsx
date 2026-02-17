import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-rust/20 selection:text-rust">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
