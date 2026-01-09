import GuestHome from "./GuestHome";
import PatientHome from "../patient/PatientHome";


function Home() {

    //THIS IS PLACEHOLDER CODE
    //REPLACE WITH AUTHENTICATION OF USER TO DETERMINE IF USER EXISTS AND THE USER ROLE
    const user = false;

    //If there is no user, return the GuestHome page
    if (!user) return <GuestHome/>;
    
    //PLACE HOLDER CODE
    if (user) return <PatientHome/>;

    //WHAT IT SHOULD LOOK LIKE IN THE FUTURE
    /*
    if (user.role === "PATIENT") return <PatientHome />;
    if (user.role === "DOCTOR") return <DoctorHome />;
    if (user.role === "ADMIN") return <AdminHome />;
    */

}

export default Home;