import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

// =====================================================
// PUBLIC COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// =====================================================
// ADMIN PAGES
// =====================================================

import Admin from "./admin/Admin";
import Dashboard from "./admin/Dashboard";
import Enquiries from "./admin/Enquiries";
import Clients from "./admin/Clients";
import Projects from "./admin/Projects";
import Quotations from "./admin/Quotations";
import Analytics from "./admin/Analytics";
import Settings from "./admin/Settings";

// =====================================================
// LAYOUT
// =====================================================

function Layout() {

    const location = useLocation();

    // Check whether current page is an admin page
    const isAdmin = location.pathname.startsWith("/admin");

    return (
        <>

            {/* =================================================
                PUBLIC NAVBAR
                Hidden on all /admin pages
            ================================================= */}

            {!isAdmin && <Navbar />}


            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <main>
                <Routes>

                    {/* =================================================
                        PUBLIC WEBSITE
                    ================================================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />


                    {/* =================================================
                        ADMIN LOGIN
                    ================================================= */}

                    <Route
                        path="/admin"
                        element={<Admin />}
                    />


                    {/* =================================================
                        ADMIN DASHBOARD
                    ================================================= */}

                    <Route
                        path="/admin/dashboard"
                        element={<Dashboard />}
                    />


                    {/* =================================================
                        ADMIN ENQUIRIES
                    ================================================= */}

                    <Route
                        path="/admin/enquiries"
                        element={<Enquiries />}
                    />


                    {/* =================================================
                        ADMIN CLIENTS
                    ================================================= */}

                    <Route
                        path="/admin/clients"
                        element={<Clients />}
                    />


                    {/* =================================================
                        ADMIN PROJECTS
                    ================================================= */}

                    <Route
                        path="/admin/projects"
                        element={<Projects />}
                    />


                    {/* =================================================
                        ADMIN QUOTATIONS
                    ================================================= */}

                    <Route
                        path="/admin/quotations"
                        element={<Quotations />}
                    />


                    {/* =================================================
                        ADMIN ANALYTICS
                    ================================================= */}

                    <Route
                        path="/admin/analytics"
                        element={<Analytics />}
                    />


                    {/* =================================================
                        ADMIN SETTINGS
                    ================================================= */}

                    <Route
                        path="/admin/settings"
                        element={<Settings />}
                    />


                    {/* =================================================
                        404
                    ================================================= */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>
            </main>


            {/* =================================================
                PUBLIC FOOTER
                Hidden on all /admin pages
            ================================================= */}

            {!isAdmin && <Footer />}


            {/* =================================================
                SCROLL TO TOP
                Hidden on all /admin pages
            ================================================= */}

            {!isAdmin && <ScrollToTopButton />}

        </>
    );
}


// =====================================================
// APP
// =====================================================

function App() {

    return (
        <BrowserRouter>

            <Layout />

        </BrowserRouter>
    );
}

export default App;