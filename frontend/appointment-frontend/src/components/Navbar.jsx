function Navbar() {
    return (
        <nav>
            {/* Logo + Name of Application */}
            {/* Goes to Home.jsx */}
            <div>
                Smart Appointment & Care
            </div>

            {/* Links */}
            <div>
                <div>Doctors</div> {/*goes to DoctorsBrowse.jsx*/}

                {/* if guest, goes to Login.jsx */}
                {/* if logged in, goes to BookAppointment.jsx*/}
                <div>Book an Appointment</div> 

                {/* if guest, goes to Login.jsx */}
                {/* if logged in, goes to PatientProfile.jsx*/}
                <div>Profile</div> 
            </div>
        </nav>
    )
}

export default Navbar;