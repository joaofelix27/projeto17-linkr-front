import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GlobalStyle from "../../theme/globalStyle.js";
import UserContext from "../../contexts/UserContext.js";
import { useEffect, useState } from "react";
import Login from "../../pages/Login.jsx";
import Register from "../../pages/Register/Register.jsx";
import Timeline from "../../pages/Timeline.js";
import UserPage from "../../pages/UserPage.js";
import "react-toastify/dist/ReactToastify.css";
import "./_app.css";
import Hashtags from "../../pages/Hashtags.js";
import axios from "axios";

export default function App() {
    const [token, setToken] = useState(localStorage.getItem("authToken"));
    const [image, setImage] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [control,setControl] = useState(false);
    const [load,setLoad] = useState(false);

    useEffect(()=>{
        if(window.location.pathname !== "/" && window.location.pathname !== "/signup"){
            getUserData();
        }
    },[])

    async function getUserData(){
        if(token){
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/data`,config);
            setImage(result.data.picture);
            setName(result.data.username);
        }
    }
    const userContext = {
        token,
        setToken,
        image,
        setImage,
        name,
        setName,
        userId,
        setUserId,
        control,
        setControl,
        load,
        setLoad
    };

    return (
        <BrowserRouter>
            <GlobalStyle />
            <UserContext.Provider value={userContext}>
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
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/timeline/user/:id" element={<UserPage />} />
                    <Route path="/hashtag/:hashtag" element={<Hashtags />} />
                </Routes>
            </UserContext.Provider>
        </BrowserRouter>
    );
}
