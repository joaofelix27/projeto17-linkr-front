import styled from "styled-components";
import { useState, useContext } from "react";
import axios from "axios";

import UserContext from "../contexts/UserContext";

export default function SendPostCard({getPosts}) {
    const { image, token } = useContext(UserContext);
    const [link, setLink] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);

    async function publish(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const post = {
                link,
                body
            };
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.post("https://projeto17-linkr-api2.herokuapp.com/timeline/create", post, config);
            await getPosts();
            setLoading(false);
            setLink("");
            setBody("");
            
        } catch (e) {
            alert("Houve um erro ao publicar seu link");
            console.log(e);
            setLoading(false);
        };
    };

    function contentButton(){
        if(loading){
            return "Publishing...";
        };
        return "Publish";
    };



    return(
        <Container>
            <ProfilePhoto>
                <img src={image} alt="" />
            </ProfilePhoto>
            <form onSubmit={publish}>
                <h3>What are you going to share today?</h3>
                
                <input 
                    type="url" 
                    placeholder="http://" 
                    required 
                    onChange={(e)=>setLink(e.target.value)} 
                    value={link}
                    disabled={loading}
                />

                <input 
                    class="text" 
                    type="text" 
                    placeholder="Awesome article about #javascript" 
                    onChange={(e)=>setBody(e.target.value)} 
                    value={body}
                    disabled={loading}
                />

                <ButtonBox>
                    <Button disabled={loading}>{contentButton()}</Button>
                </ButtonBox>
            </form>
        </Container>
    )
};

const Container = styled.div`
    width: 720px;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 17px;
    padding-right: 22px;
    margin-bottom: 30px;
    display: flex;
    font-family: Lato;
    h3{
        font-weight: 300;
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 10px;
        color: #707070;
    }
    form{
        padding-top: 10px;
        width: 100%;
        display: flex;
        flex-direction: column
    }
    input{
        border: none;
        border-radius: 5px;
        background-color:#EFEFEF;
        width: 100%;
        margin-bottom: 5px;
        height: 30px;
        padding: 5px;
        ::placeholder{
            font-family: 'Lato';
            color: #949494;
            font-weight: 300;
            font-size: 15px;

        }
    }
    .text{
        display: flex;
        padding-bottom: 70px;
        height: 100px;
    }

    @media only screen and (max-width: 720px) {
        width: 100%;
    }
    
`
const Button = styled.button`
  
        color: white;
        font-weight: 700;
        border: none;
        background-color:#1877F2;
        width: 115px;
        height: 32px;
        border-radius: 5px;
        opacity: ${props=> props.disabled? '70%': '100%'};

    
`
const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    img{
        width: 58px;
        height: 58px;
        border-radius: 50%;
        margin-right: 3px;
        object-fit: cover;
    }
`

const ButtonBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
`