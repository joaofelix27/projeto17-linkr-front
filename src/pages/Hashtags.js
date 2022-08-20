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
    const { token, setToken, setImage, setName } = useContext(UserContext);
    const [posts, setPosts] = useState("");
    const [trending, setTrending] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOnSentinel, setIsOnSentinel] = useState("sentinela");
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

        if (trending === "") {
            getTrending();
        }
        getPosts()
    }, [hashtag]);

    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const promisse = axios
            .get(
                `${process.env.REACT_APP_BASE_URL}/hashtags/${hashtag}?page=${currentPage}`,
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
    }, [currentPage]);

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
        try {
            const result = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/hashtags/${hashtag}?page=${currentPage}`,
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
                    comment,
                    repost
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
                        reposts={repost}
                        postId={id}
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
                        <h2># {hashtag}</h2>
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
                    <TrendingHashtags hashtags={trending} setCurrentPage={setCurrentPage} setPosts={setPosts}  />
                    </RightContent>
                </ContentBody>
            </Content>
        </Container>
    );
}
