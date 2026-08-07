import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

import Home from "./pages/Home";
import Admin from "./admin/Admin";
import Dashboard from "./admin/Dashboard";
import Enquiries from "./admin/Enquiries";
import Clients from "./admin/Clients";
import Projects from "./admin/Projects";
import Quotations from "./admin/Quotations";
import Analytics from "./admin/Analytics";
import Settings from "./admin/Settings";
import NotFound from "./pages/NotFound";

function Layout() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/enquiries" element={<Enquiries />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path ="/admin/quotations" element={<Quotations />} />          
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTopButton />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;