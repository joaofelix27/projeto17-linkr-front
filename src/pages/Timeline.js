import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";


export default function Timeline() {
    
    const [posts, setPosts] = useState("");

    useEffect(()=>{
        if(posts === ""){
            getPosts();
        }
    },[]);
    
    async function getPosts() {
        try {
            const result = await axios.get("http://localhost:4000/timeline");
            setPosts(result.data);
        } catch (e) {
            alert("An error occured while trying to fetch the posts, please refresh the page");
            console.log(e);
        };
    };

    function renderPosts() {
        if(posts){
            const timeline = posts.map(({id, username, picture, link, body, title, image, description})=> 
                <PostCard
                    key={id}
                    name={username} 
                    profileImage={picture} 
                    url={link} 
                    text={body}
                    titleUrl={title}
                    imageUrl={image}
                    descriptionUrl={description}
                />
            );
            return timeline;
        };
        if(posts === []) return <span>There are no posts yet</span>;
        return <span>Loading...</span>;
    }

    return(
    <Container>
        <TimelineHeader/>
        
        <Content>
            <h2>timeline</h2>
            <SendPostCard getPosts={getPosts}/>
            {renderPosts()}
        </Content>
        
    </Container>
    );
};

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #333333;
    
    h2{
        width: 720px;
        margin: 50px 0px;
        font-weight: 700;
        font-size: 43px;
        color: white;
    }
    span{
        font-weight: 700;
        font-size: 43px;
        color: white;
    }

`
const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
`