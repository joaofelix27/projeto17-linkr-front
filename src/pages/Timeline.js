import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";
import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";
import RepostCard from "../components/RepostCard";
import TrendingHashtags from "../components/TrendingHashtags";
import { DebounceInput } from "react-debounce-input";
import SearchBoxMobile from "../components/SearchBoxMobile";

export default function Timeline() {
  const { token, setImage, setName, setToken, control} = useContext(UserContext);
  const [posts, setPosts] = useState("");
  const [reposts, setReposts] = useState("");
  const [trending, setTrending] = useState("");
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

  useEffect(() => {
    let check = control;
    if (!token) {
      navigate("/");
    }
    if (posts === "") {
      getPosts();
    }
    if (reposts === "" || check !== control) {
      check = control;
      getReposts();
    }
    if (trending === "") {
      getTrending();
    }
  }, [control]);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const promisse = axios
            .get(
                `${process.env.REACT_APP_BASE_URL}/timeline?page=${currentPage}`,
                config
            )
            .then((res) => {
                setPosts([...posts, ...res.data.postsMetadata]);
                setImage(res.data.userInfo?.picture);
                setName(res.data.userInfo?.username);

                if (res.data.postsMetadata.length === 0) {
                    setIsOnSentinel("isOff");
                }
            })
            .catch((e) => {
                notify(
                    "An error occured while trying to fetch the posts, please refresh the page"
                );
                console.log(e);
            });
    }, [currentPage ]);

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

    async function getPosts() {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const promisse = axios
            .get(
                `${process.env.REACT_APP_BASE_URL}/timeline?page=1`,
                config
            )
            .then((res) => {
                setCurrentPage(1)
                setIsOnSentinel("sentinela")
                setPosts(res.data.postsMetadata);
                setImage(res.data.userInfo?.picture);
                setName(res.data.userInfo?.username);
            })
            .catch((e) => {
                notify(
                    "An error occured while trying to fetch the posts, please refresh the page"
                );
                console.log(e);
            });
    }

  async function getReposts() {
    console.log("tentando repost")
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/timeline/reposts`,
        config
      );
      setReposts(result.data);
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

  console.log(posts)

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
          reposts,
          createdAt,
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
            postId={id}
            creatorId={userId}
            setPosts={setPosts}
            getPosts={getPosts}
            getTrending={getTrending}
            reposts={reposts}
            createdAt={createdAt}
          />
        )
      ); 
      if(reposts){
        const timelineReposts = reposts.map(
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
            reposts,
            reposter,
            reposterId,
            createdAt
          }) => (
            <RepostCard
              key={id}
              name={username}
              profileImage={picture}
              url={link}
              text={body}
              titleUrl={title}
              imageUrl={image}
              descriptionUrl={description}
              likes={like}
              postId={id}
              creatorId={userId}
              setPosts={setPosts}
              getReposts={getReposts}
              getTrending={getTrending}
              reposts={reposts}
              reposter={reposter}
              reposterId={reposterId}
              createdAt={createdAt}
            />
          )
        );
        const allposts = [...timeline,...timelineReposts];
    
        const sortedPosts = allposts.sort(function(x, y){
          return new Date(x.props.createdAt).getTime() - new Date(y.props.createdAt).getTime();
      });

      return sortedPosts.reverse();
      }
  
      return timeline;
    }
}
    return (
        <Container>
            <TimelineHeader />
            <Content>
                <ContentBody>
                    <LeftContent>
                        <DebounceInput
                            element={SearchBoxMobile}
                            debounceTimeout={300}
                        />
                        <h2>timeline</h2>
                        <SendPostCard
                            getPosts={getPosts}
                            getTrending={getTrending}
                        />
                        {renderPosts()}
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

    @media screen and (max-width: 1060px) {
        margin-top: 42px;
    }
`;
export const ContentBody = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;
export const LeftContent = styled.div`
  width: 711px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right:25px;
  gap: 30px;

  h2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;

  }

    li {
        margin-bottom: 5px;
        color: #b6b6b6;
        font-size: 18px;
        list-style: none;
    }

    h2 {
        display: flex;
        justify-content: left;
        width: 100%;
        font-weight: 700;
        font-size: 43px;
        color: white;
        margin-top: 50px;
        margin-bottom: 50px;
        text-align: left;
    }

    @media only screen and (max-width: 1060px) {
        width: 100%;
        margin-right: 0;

        h2 {
            margin-top: 70px;
            padding-left: 28px;
        }
        div {
            border-radius: 0;
        }
    }
`;

export const RightContent = styled.div`
  margin-top: ${props => props.userPage===true ? "50px":"141px"};
  width: 301px;
  display: flex;
  flex-direction:column;  
  align-items:flex-end;

    @media only screen and (max-width: 1060px) {
        h2 {
            width: 100%;
            padding-left: 22px;
            margin-right: 0;
        }
    }

    @media only screen and (max-width: 1060px) {
        display: none;
    }
`;
