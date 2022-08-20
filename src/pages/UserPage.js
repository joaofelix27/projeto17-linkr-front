import styled from "styled-components";
import TimelineHeader from "../components/TimelineHeader.js";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard.js";
import { Container, Content } from "./Timeline.js";
import { ContentBody, LeftContent, RightContent } from "./Timeline.js";
import TrendingHashtags from "../components/TrendingHashtags.js";
import SearchBoxMobile from "../components/SearchBoxMobile.js";
import { DebounceInput } from "react-debounce-input";
import UserContext from "../contexts/UserContext.js";
import { Circles } from "react-loader-spinner";

export default function UserPage() {
    const { token, control, load, setLoad, setToken } = useContext(UserContext);
    const [posts, setPosts] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [isMyPage, setIsMyPage] = useState(true);
    const [followed, setFollowed] = useState("");
    const [trending, setTrending] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOnSentinel, setIsOnSentinel] = useState("sentinela");
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

  const { id } = useParams();

    const reload = useEffect(() => {
        getPosts();
        getFollow();
    }, [control, currentPage]);

    function getPosts() {
        if (!token) {
            navigate("/");
        }
        getTrending();

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const promise = axios.get(
            `${process.env.REACT_APP_BASE_URL}/timeline/user/${id}?page=${currentPage}`,
            config
        );
        const promiseUser = axios.get(
            `${process.env.REACT_APP_BASE_URL}/user/${id}`
        );

        promise.then((res) => {
            setLoad(false);
            setPosts([...posts, ...res.data]);

            if (res.data.length === 0) {
                setIsOnSentinel("isOff");
            }
        });

        promise.catch((Error) => {
            notify(Error.response.status);
        });
        if (posts.length === 0) {
            promiseUser.then((res) => {
                setUser(res.data.username);
            });
            promise.catch((Error) => {
                notify(Error.response.status);
            });
        }
    }
    useEffect(() => {
        if (posts.length !== 0) {
            const intersectionObserver = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setCurrentPage(
                        (currentPageInsideState) => currentPageInsideState + 1
                    );
                }
            });

            if (isOnSentinel === "sentinela") {
                intersectionObserver.observe(
                    document.querySelector("#sentinela")
                );
            }

            return () => intersectionObserver.disconnect();
        }
    }, [posts]);

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
    async function getFollow() {
      setIsMyPage(true)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      setDisabled(true);
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/followed/${id}`,
          config
        );
        const { userId, message } = result.data;
        if (userId !== Number(id)) {
          setIsMyPage(false);
        }
        setFollowed(message);
        setDisabled(false);
      } catch (e) {
        setDisabled(false);
        notify("An error occured while trying to get if the user is followed");
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
                    comment,
                    reposts,
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
                        comments={comment}
                        postId={id}
                        reposts={reposts}
                        getTrending={getTrending}
                        getPosts={getPosts}
                    />
                )
            );
            return timeline;
        }
        if (posts === []) return <span>There are no posts yet</span>;
        return <span>Loading...</span>;
    }

async function followUser() {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  setDisabled(true);
  try {
    const body = {
      followedUserId: id,
    };
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/follow`,
      body,
      config
    );
    getFollow();
    setDisabled(false);
  } catch (e) {
    setDisabled(false);
    notify("An error occured while trying to follow the user");
    console.log(e);
  }
}

return (
  <Container>
    <TimelineHeader />
    <Content>
      <ContentBody>
        <LeftContent>
          <DebounceInput element={SearchBoxMobile} debounceTimeout={300} />
          <h2>
            {posts && posts.length ? posts[0].username + "'s posts" : user}
          </h2>
          {load ? <Circles color="crimson" /> : renderPosts()}
                        {posts.length !== 0 ? (
                            <li id={isOnSentinel}>
                                {isOnSentinel === "sentinela" &&
                                posts.length !== 0
                                    ? "Loading ..."
                                    : "There are no more posts to show right now."}
                            </li>
                        ) : null}{" "}
                        {/* verifica se o scroll chegou ao fim */}
        </LeftContent>
        <RightContent userPage={!isMyPage}>
          <ButtonContainer>
            {isMyPage ? (
              ""
            ) : (
              <FollowButton
                disabled={disabled}
                followed={followed}
                onClick={followUser}
              >
                {followed}
              </FollowButton>
            )}
          </ButtonContainer>
          <TrendingHashtags hashtags={trending} setCurrentPage={setCurrentPage}  setPosts={setPosts} />
        </RightContent>
      </ContentBody>
    </Content>
  </Container>
);
            }
export const FollowButton = styled.button`
  height: 31px;
  width: 112px;
  border-radius: 5px;
  border: 0;
  background-color: ${(props) =>
    props.followed === "Follow" ? "#1877f2" : "#FFFFFF"};
  pointer-events: ${(props) => (props.disabled ? "none" : "normal")};
  font-family: Lato;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  color: ${(props) => (props.followed === "Follow" ? "#FFFFFF" : "#1877f2")};
  margin-bottom: 60px;
`;
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
