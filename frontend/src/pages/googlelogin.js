import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleAuthProvider } from "./firebase";
import GoogleButton, { } from 'react-google-button';
import '../components/H.css';


const Login = () => {

    const navigate = useNavigate();
    const signinwithGoogle = async () => {

        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
            console.log(result);
            localStorage.setItem('token', result.user.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            navigate("/");
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
        </div>
    )
};
export default Login;
