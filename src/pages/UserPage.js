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
    const [trending, setTrending] = useState("");
    const [user, setUser] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOnSentinel, setIsOnSentinel] = useState("sentinela");
    const [teste, setTeste] = useState(0);
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
    }, [control, currentPage]);

    function getPosts() {
        console.log("opa");
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
                        <h2>
                            {posts && posts.length
                                ? posts[0].username + "'s posts"
                                : user}
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
                    <RightContent>
                        <TrendingHashtags hashtags={trending} />
                    </RightContent>
                </ContentBody>
            </Content>
        </Container>
    );
}
