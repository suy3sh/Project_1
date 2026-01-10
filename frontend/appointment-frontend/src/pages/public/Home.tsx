import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import GuestHome from "./GuestHome";


export default function Home() {

    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated || !user) {
        return <GuestHome />;
    }

    switch (user.role) {
        case "PATIENT":
            return <Navigate to="/patient/home" replace />;
        case "DOCTOR":
            return <Navigate to="/doctor/home" replace />;
        case "ADMIN":
            return <Navigate to="/admin/home" replace />;
        case "SUPER":
            return <Navigate to="/super/home" replace />;
        default:
            return <GuestHome />;
    }


}
