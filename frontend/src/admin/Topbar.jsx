import { useNavigate } from "react-router-dom";

function Topbar() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/admin");

    };

    return (
        <>
            {/* Your Topbar JSX */}

            <button onClick={logout}>
                Logout
            </button>
        </>
    );
}

export default Topbar;