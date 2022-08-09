import styled from "styled-components";
import { useEffect, useState, useContext } from "react";

import UserContext from "../contexts/UserContext";

export default function PostCard() {
    const {image} = useContext(UserContext);
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");

    function publish(e) {
        e.preventDefault();
    }


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
                    onChange={(e)=>setUrl(e.target.value)} 
                    value={url}
                />

                <input 
                    class="text" 
                    type="text" 
                    placeholder="Awesome article about #javascript" 
                    onChange={(e)=>setText(e.target.value)} 
                    value={text}
                />

                <ButtonBox>
                    <button>Publish</button>
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
    button{
        color: white;
        font-weight: 700;
        border: none;
        background-color:#1877F2;
        width: 115px;
        height: 32px;
        border-radius: 5px;

    }
`

const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    img{
        width: 58px;
        height: 58px;
        border-radius: 50%;
        margin-left: 10px;
        object-fit: cover;
    }
`

const ButtonBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
`