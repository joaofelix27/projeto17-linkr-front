import TimelineHeader from "../components/TimelineHeader.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard.js";
import { Container, Content } from "./Timeline.js";
import { ContentBody, LeftContent, RightContent } from "./Timeline.js";
import TrendingHashtags from "../components/TrendingHashtags.js";
import SearchBoxMobile from "../components/SearchBoxMobile.js";
import { DebounceInput } from "react-debounce-input";

export default function UserPage() {
    const [posts, setPosts] = useState("");
    const [trending, setTrending] = useState("");

    const { id } = useParams();

    useEffect(() => {
        getTrending();

        const promise = axios.get(
            `${process.env.REACT_APP_BASE_URL}/timeline/user/${id}`
        );

        promise.then((res) => {
            setPosts(res.data);
        });

        promise.catch((Error) => {
            alert(Error.response.status);
        });
    }, []);

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
                        <h2>{posts ? posts[0].username + "'s posts" : "loading..."}</h2>
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
