import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";
import TrendingHashtags from "../components/TrendingHashtags";

export default function Timeline() {
  const [posts, setPosts] = useState("");
  const [trending, setTrending] = useState("");

  useEffect(() => {
    if (posts === "") {
      getPosts();
    }
    if (trending === "") {
        getTrending();
      }
  }, []);

  async function getPosts() {
    try {
      const result = await axios.get("http://localhost:4000/timeline");
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
      const result = await axios.get("http://localhost:4000/trending");
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
        ({ id, username, picture, link, body, title, image, description, userId }) => (
          <PostCard
            key={id}
            name={username}
            profileImage={picture}
            url={link}
            text={body}
            titleUrl={title}
            imageUrl={image}
            descriptionUrl={description}
            userId={userId}
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
          <h2>timeline</h2>
            <SendPostCard getPosts={getPosts} />

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


export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #333333;
  span {
    font-weight: 700;
    font-size: 43px;
    color: white;
  }
`;
export const Content = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ContentBody = styled.div`
  width: 100%;
  display: flex;
  justify-content:center;
`;
const LeftContent = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    display:flex;
    justify-content:left;
    width:100%;
    font-weight: 700;
    font-size: 43px;
    color: white;
    margin-bottom: 50px;
    text-align: left;
  }
`;
const RightContent = styled.div`
margin-top:93px;
  width: 20%;
  display: flex;
  margin-left: 25px;
  
@media only screen and (max-width: 720px) {
        h2{
            width: 100%;
            padding-left: 22px;
            margin-right: 0;
        }
`;