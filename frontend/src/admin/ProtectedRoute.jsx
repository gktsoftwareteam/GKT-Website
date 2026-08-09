import React, {
    useEffect,
    useState,
} from "react";

import {
    Navigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

function ProtectedRoute({
    children,
}) {
    const [loading, setLoading] =
        useState(true);

    const [authorized, setAuthorized] =
        useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const {
                    data: {
                        session,
                    },
                } =
                    await supabase.auth.getSession();

                if (!session?.user) {
                    setAuthorized(false);
                    return;
                }

                const {
                    data: admin,
                    error,
                } =
                    await supabase
                        .from(
                            "admin_users"
                        )
                        .select("id")
                        .eq(
                            "id",
                            session.user.id
                        )
                        .maybeSingle();

                if (error) {
                    console.error(
                        "PROTECTED ROUTE ERROR:",
                        error
                    );

                    setAuthorized(false);
                    return;
                }

                setAuthorized(
                    Boolean(admin)
                );
            } catch (error) {
                console.error(
                    "AUTH CHECK ERROR:",
                    error
                );

                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    minHeight:
                        "100vh",
                    display: "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                Checking access...
            </div>
        );
    }

    if (!authorized) {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;