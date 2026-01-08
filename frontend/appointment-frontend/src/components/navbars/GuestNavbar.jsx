
import { FaHospital } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
                
                <Link className="nav_link" to="/">
                    <div className="flex items-center gap-3 text-2xl font-bold">
                        <FaHospital />
                        Smart Appointment System
                    </div>
                </Link>

                <div className="flex gap-6">
                    <Link className="nav-link" to="/doctors"><button className="hover:underline">Doctors</button></Link>


                    

                </div>
            </div>
        </nav>
    )
}

export default Navbar;