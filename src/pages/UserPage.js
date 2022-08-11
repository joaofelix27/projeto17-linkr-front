import TimelineHeader from "../components/TimelineHeader.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard.js";
import { Container, Content } from "./Timeline.js";

export default function UserPage() {
    const [posts, setPosts] = useState("");

    const { id } = useParams();

    useEffect(() => {
        const promise = axios.get(
            `https://projeto17-linkr-api2.herokuapp.com/timeline/user/${id}`
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
                <h2>{posts ? posts[0].username + "'s posts" : "loading..."}</h2>
                {renderPosts()}
            </Content>
        </Container>
    );
}
