import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import { Container } from "./Register.js";
import { ThreeDots } from "react-loader-spinner";
import Header from "../../components/Header.js";

const notify = (error)=>{
    toast(`❗ ${error}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

export default function Register(){
    const [userName,setUserName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [picture,setPicture] = useState('');
    const [load,setLoad] = useState(false);

    const navigate = useNavigate();

    function signUp(event){
        event.preventDefault();
        setLoad(true);

        const body = {
            username: userName,
            email,
            password,
            picture
        }

        const promise = axios.post('https://projeto17-linkr-api2.herokuapp.com/signup',body);

        promise.then(()=>{
            setLoad(false);
            navigate('/');
        })

        promise.catch(Error => {
            if(Error.response.status === 422){
                setLoad(false);
                notify("Preencha os dados corretamente!");
            }
            if(Error.response.status === 409){
                setLoad(false);
                notify("Email já está cadastrado!");
            }
            if(Error.response.status === 500){
                setLoad(false);
                notify("Erro no servidor!");
            }  
        })
    }

    return(
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
            <form onSubmit={signUp}>
                <input type="email"
                placeholder="e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)} />
                <input type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)} />
                <input type="text"
                placeholder="username"
                value={userName}
                onChange={e => setUserName(e.target.value)} />
                <input type="text"
                placeholder="picture"
                value={picture}
                onChange={e => setPicture(e.target.value)} 
                 />
                <button type="submit" disabled={load}>
                    {
                        load ?
                        <ThreeDots />
                            :
                        <h3>Sign Up</h3>    
                    }
                </button>
            </form>
            <div className="back">
                <h1 onClick={()=>navigate('/')}>Switch back to login</h1>
            </div>  
        </Container>
    )
}