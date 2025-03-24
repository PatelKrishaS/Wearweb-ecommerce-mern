import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const useAuth = () => {
    const [authState, setAuthState] = useState({ isLoggedin: false, role: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");
        const loginTime = localStorage.getItem("loginTime");

        console.log("LocalStorage ID:", id);
        console.log("LocalStorage Role:", role);
        console.log("Login Time:", loginTime);

        // Check if the session has expired (e.g., 24 hours)
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const currentTime = new Date().getTime();
        const isSessionExpired = loginTime && currentTime - loginTime > sessionDuration;

        if (id && !isSessionExpired) {
            setAuthState({ isLoggedin: true, role });
        } else {
            // Clear localStorage if the session has expired
            localStorage.removeItem("id");
            localStorage.removeItem("role");
            localStorage.removeItem("loginTime");
        }

        setLoading(false);
    }, []);

    return { ...authState, loading };
};

const PrivateRoutes = () => {
    const auth = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Auth State:", auth);
        console.log("Location:", location);

        if (auth.loading) {
            console.log("Loading...");
            return; // Wait for auth state to be set
        }

        // Redirect to login if not logged in
        if (!auth.isLoggedin) {
            console.log("User not logged in. Redirecting to /login");
            navigate("/login", { state: { from: location }, replace: true });
            return;
        }

        // Check if the user's role matches the required role for the route
        const requiredRole = location.pathname.split("/")[1]; // Extract the required role from the URL
        console.log("Required Role:", requiredRole);
        console.log("User Role:", auth.role);

        if (auth.role.toLowerCase() !== requiredRole.toLowerCase()) {
            console.log("Role mismatch. Redirecting to default route");
            navigate(`/${auth.role.toLowerCase()}`, { replace: true });
            return;
        }
    }, [auth, location, navigate]);

    if (auth.loading) {
        return <h1>Loading...</h1>; // Show loading state
    }

    // Allow access if the user's role matches the required role
    return <Outlet />;
};

export default PrivateRoutes;