import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";

import {IoPaperPlaneOutline} from "react-icons/io5"
import Comment from "./Comment";
import axios from "axios";

export default function Comments({show, postId, notify, setComment}) {
    const {image, token} = useContext(UserContext);
    const [myComment, setMyComment] = useState("");
    const[load, setLoad] = useState(false);
    const [comments, setComments] = useState("");
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    useEffect(()=>{
        if(!comments && show)  getComments();
    },[show])
    async function getComments(){
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/comments/${postId}`, config);
            setComments(result.data);
            setComment(result.data.length);
        } catch (e) {
            console.log(e);
            notify("An error occured while trying to get comments, please refresh the page");
        }
    }
    async function sendComment(e){
        e.preventDefault();
        setLoad(true);
        
        const body = {
            text: myComment
        }
        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/comments/${postId}`, body, config);
            setLoad(false);
            setMyComment("");
            getComments();
        } catch (e) {
            console.log(e);
            notify("An error occured while trying to send comment, please refresh the page");
        }
    };
    function renderComments(){
        if(comments){
            return comments.map(({isPostAuthor, follow, username, picture, text})=>
                <Comment 
                    follow={follow}
                    isPostAuthor={isPostAuthor}
                    name={username} 
                    profileImg={picture} 
                    text={text}
                />
            )
        }
    }

    
    
    return(
        <Container show={show}>
            <CommentsBox>
                {renderComments()}
            </CommentsBox>
            <CommentInputBox onSubmit={sendComment}>
                <img src={image} alt="" />
                <input 
                    type="text" 
                    placeholder="write a comment..."
                    onChange={(e)=> setMyComment(e.target.value)}
                    value={myComment}
                    disabled={load}
                    required
                />
                <button disabled={load}>
                    <IoPaperPlaneOutline color="#fff" size={18}/>
                </button>
            </CommentInputBox>
        </Container>
    );
};

const Container = styled.div`
    display:${props => props.show? "flex": "none" };
    flex-direction: column;
    width: 100%;
    background-color: #1E1E1E;
    margin-bottom: 30px;
    padding: 13px 25px;
    padding-bottom: 25px;
    border-radius: 0px 0px 16px 16px;
    box-sizing: border-box;
    padding-top: 12px;
    margin-top: -11px;
    img{
        width: 45px;
        border-radius: 50%;
    }
`;

const CommentsBox = styled.div`
`;

const CommentInputBox = styled.form`
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 23px;
    input{
        color: white;
        box-sizing: border-box;
        padding: 10px;
        background-color: #252525;
        width: 90%;
        height: 40px;
        border: none;
        border-radius: 8px;
        ::placeholder{
            font-style: italic;
        }
        :disabled{
            opacity: 30%;
        }
    }
    button{
        background-color: transparent;
        border: none;
        position: absolute;
        right: 10px;
        top: 9px;
        :disabled{
            opacity: 30%;
        }
    }
`;