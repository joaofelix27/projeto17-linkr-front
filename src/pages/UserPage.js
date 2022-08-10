import TimelineHeader from "../components/TimelineHeader.js";
import styled from "styled-components";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard.js";

export default function UserPage(){
    const [posts, setPosts] = useState("");

    const { id } = useParams();

    useEffect(()=>{
        console.log(id)
        const promise = axios.get(`https://projeto17-linkr-api2.herokuapp.com/timeline/user/${id}`);

        promise.then(res=>{
            setPosts(res.data);
        })

        promise.catch(Error=>{
            alert(Error.response.status);
        })
    },[])

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
        <TimelineHeader />
        
        <Content>
            <h2>
                {
                 posts ? posts[0].username + "'s posts" : "loading..."
                }
            </h2>
            {renderPosts()}
        </Content>
        
    </Container>
    )
}

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