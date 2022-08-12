import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TimelineHeader from "../components/TimelineHeader";
import PostCard from "../components/PostCard";
import TrendingHashtags from "../components/TrendingHashtags";
import { Container, Content, LeftContent, RightContent, ContentBody } from "./Timeline.js";


export default function Hashtags() {
    const [posts, setPosts] = useState("");
    const [trending, setTrending] = useState("");
    const { hashtag } = useParams();
    

    useEffect(() => {
    getPosts();
    if (trending === "") {
      getTrending();
    }
  }, [hashtag]);
 
    async function getPosts() {
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/hashtags/${hashtag}`
            );
            setPosts(result.data);
        } catch (e) {
            alert(
                "An error occured while trying to fetch the posts, please refresh the page"
            );
            console.log(e);
        }
    }
    async function getTrending() {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/trending`);
            setTrending(result.data);
        } catch (e) {
            alert(
                "An error occured while trying to fetch the trending hashtags, please refresh the page"
            );
            console.log(e);
        }
    }

    function renderPosts() {
        if (posts) {
            const timeline = posts.map(
                ({
                    id,
                    username,
                    picture,
                    link,
                    body,
                    title,
                    image,
                    description,
                    userId,
                    like
                }) => (
                    <PostCard
                    key={id}
                    name={username}
                    profileImage={picture}
                    url={link}
                    text={body}
                    titleUrl={title}
                    imageUrl={image}
                    descriptionUrl={description}
                    creatorId={userId}
                    likes={like}
                    postId={id}
                    />
                )
            );
            return timeline;
        }
        if (posts === []) return <span>There are no posts yet</span>;
        return <span>Loading...</span>;
    }

    return (
        <Container>
            <TimelineHeader />

            <Content>
                <ContentBody>
                    <LeftContent>
                        <h2># {hashtag}</h2>
                        {renderPosts()}
                    </LeftContent>
                    <RightContent>
                        <TrendingHashtags hashtags={trending} />
                    </RightContent>
                </ContentBody>
            </Content>
        </Container>
    );
}


