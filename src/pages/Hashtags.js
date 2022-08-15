import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TimelineHeader from "../components/TimelineHeader";
import PostCard from "../components/PostCard";
import TrendingHashtags from "../components/TrendingHashtags";
import {
  Container,
  Content,
  LeftContent,
  RightContent,
  ContentBody,
} from "./Timeline.js";
import { DebounceInput } from "react-debounce-input";
import SearchBoxMobile from "../components/SearchBoxMobile";
import UserContext from "../contexts/UserContext";

export default function Hashtags() {
  const { token, setToken } = useContext(UserContext);
  const [posts, setPosts] = useState("");
  const [trending, setTrending] = useState("");
  const { hashtag } = useParams();
  const navigate = useNavigate();
  setToken(localStorage.getItem("authToken"));
  const notify = (error) => {
    toast(`❗ ${error}`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    getPosts();
    if (trending === "") {
      getTrending();
    }
  }, [hashtag]);

  async function getPosts() {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/hashtags/${hashtag}`,
        config
      );
      setPosts(result.data.postsMetadata);
    } catch (e) {
      notify(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
      console.log(e);
    }
  }
  async function getTrending() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/trending`
      );
      setTrending(result.data);
    } catch (e) {
      notify(
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
            <DebounceInput element={SearchBoxMobile} debounceTimeout={300} />
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
