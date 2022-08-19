import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container } from "./Register/Register.js";
import { ThreeDots } from "react-loader-spinner";
import Header from "../components/Header.js";
import UserContext from "../contexts/UserContext";

const notify = (error) => {
    toast.error(`❗ ${error}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState(false);

    const navigate = useNavigate();
    const { setToken,token, setImage, setName } = useContext(UserContext);

    useEffect(()=>{
        if(token) navigate("/timeline");
    },[]);

    function signIn(event) {
        event.preventDefault();
        setLoad(true);

        const body = {
            email,
            password,
        };
        console.log(process.env.REACT_APP_BASE_URL);
        const promise = axios.post(`${process.env.REACT_APP_BASE_URL}/`, body);

        promise.then((res) => {
            setLoad(false);
            localStorage.setItem("authToken", res.data.token);
            setImage(res.data.image);
            setName(res.data.name);
            setToken(localStorage.getItem("authToken"));
            navigate("/timeline");
        });

        promise.catch((Error) => {
            setLoad(false);
            if (Error.response.status === 401) {
                notify("User isn't registered or password is incorrect!");
            }
            if (Error.response.status === 500) {
                notify("Server error!");
            }
        });
    }

    return (
        <Container>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={true}
                limit={1}
            />
            <Header />
            <div className="right">
                <form onSubmit={signIn}>
                    <input
                        type="email"
                        placeholder="e-mail"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" disabled={load}>
                        {load ? <ThreeDots /> : <h3>Sign In</h3>}
                    </button>
                </form>
                <div className="back">
                    <h1 onClick={() => navigate("/signup")}>
                        First time? Create an account!
                    </h1>
                </div>
            </div>
        </Container>
    );
}
