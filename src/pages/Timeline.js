import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";
import TimelineHeader from "../components/TimelineHeader";
import SendPostCard from "../components/SendPostCard";
import PostCard from "../components/PostCard";
import TrendingHashtags from "../components/TrendingHashtags";
import { DebounceInput } from "react-debounce-input";
import SearchBoxMobile from "../components/SearchBoxMobile";

export default function Timeline() {
    const { token, setImage, setName } = useContext(UserContext);
    const [posts, setPosts] = useState("");
    const [trending, setTrending] = useState("");
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
        if (posts === "") {
            getPosts();
        }
        if (trending === "") {
            getTrending();
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
                `${process.env.REACT_APP_BASE_URL}/timeline`,
                config
            );
            setPosts(result.data.postsMetadata);
            setImage(result.data.userInfo?.picture);
            setName(result.data.userInfo?.username);
        } catch (e) {
            notify(
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
                        likes={like}
                        postId={id}
                        creatorId={userId}
                        setPosts={setPosts}
                        getPosts={getPosts} 
                        getTrending={getTrending}
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
                        <h2>timeline</h2>
                        <SendPostCard getPosts={getPosts} getTrending={getTrending} />

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

    @media screen and (max-width:1060px) {
        margin-top: 42px;
    }
`;
export const ContentBody = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;
 export const LeftContent = styled.div`
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
        display: flex;
        justify-content: left;
        width: 100%;
        font-weight: 700;
        font-size: 43px;
        color: white;
        margin-top: 50px;
        margin-bottom: 50px;
        margin-left: 40px;
        text-align: left;
    }

    @media only screen and (max-width: 1060px) {
        width: 100%;

        div{
            border-radius: 0;
        }
    }
`;
export const RightContent = styled.div`
    margin-top: 93px;
    width: 20%;
    display: flex;
    margin-left: 25px;

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
