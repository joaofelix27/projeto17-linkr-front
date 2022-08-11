import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
<<<<<<< HEAD

import UserContext from "../contexts/UserContext";
import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";

export default function Timeline() {
    const { token, setImage, setName } = useContext(UserContext);
    const [posts, setPosts] = useState("");

    useEffect(() => {
        if (posts === "") {
            getPosts();
        }
    }, []);

    async function getPosts() {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const result = await axios.get(
                "http://localhost:4000/timeline",
                config
            );
            setPosts(result.data.postsMetadata);
            setImage(result.data.userInfo?.picture);
            setName(result.data.userInfo?.username);
        } catch (e) {
            alert(
                "An error occured while trying to fetch the posts, please refresh the page"
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
                    like,
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
                        likes={like}
                        postId = {id}
                    />
                )
            );
            return timeline;
        }
        if (posts === []) return <span>There are no posts yet</span>;
        return <span>Loading...</span>;
=======
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

>>>>>>> 84457b2ecc235b06f95d6c71b27a45abce4fd0f8
    }
    if (posts === []) return <span>There are no posts yet</span>;
    return <span>Loading...</span>;
  }

<<<<<<< HEAD
    return (
        <Container>
            <TimelineHeader />

            <Content>
                <h2>timeline</h2>
                <SendPostCard getPosts={getPosts} />
                {renderPosts()}
            </Content>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #333333;

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #151515;
        min-height: 80px;
        height: 8vh;
        padding: 0 20px;
        position: relative;

        h1 {
            color: #ffffff;
            font-family: "Passion One";
            font-style: normal;
            font-weight: 700;
            font-size: 49px;
            line-height: 54px;
            letter-spacing: 0.05em;
        }

        .profile {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;

            img,
            svg {
                cursor: pointer;
            }

            img {
                width: 54px;
                height: 54px;
                border-radius: 50%;
                margin-left: 10px;
            }

            .logout {
                display: ${(props) => (props.openMenu ? "flex" : "none")};
                justify-content: center;
                align-items: center;
                width: 150px;
                height: 46px;
                position: absolute;
                color: #ffffff;
                bottom: -40px;
                right: 0;
                background: #171717;
                border-radius: 0px 0px 20px 20px;
                cursor: pointer;

                h2 {
                    font-family: "Lato";
                    font-style: normal;
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 20px;
                    letter-spacing: 0.05em;
                }
            }
        }
    }

    h2 {
        width: 720px;
        margin: 50px 0px;
        font-weight: 700;
        font-size: 43px;
        color: white;
    }
    span {
        font-weight: 700;
        font-size: 43px;
        color: white;
    }
`;
const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
=======
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
>>>>>>> 84457b2ecc235b06f95d6c71b27a45abce4fd0f8
