import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "./firebase";
import GoogleButton, { } from 'react-google-button';
import '../components/H.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const signinwithGoogle = async () => {

        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            console.log(result);
            localStorage.setItem('token', result.user.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate("/");
            toast.success(`Login successfully , hello ${user.displayName}`)
        }
        catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <GoogleButton className="gbtn"
                onClick={signinwithGoogle}
            />
            <ToastContainer
                position="top-right"
                autoClose={1000} // Close the toast after 3 seconds
            />
        </div>
    )
};
export default Login;
