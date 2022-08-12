import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import styled from "styled-components";
import UserContext from "../contexts/UserContext";
import animationData from "../assets/like-icon.json";
import { ReactTagify } from "react-tagify";
import { useNavigate } from "react-router-dom";


export default function PostCard({
    key,
    name,
    profileImage,
    url,
    text,
    titleUrl,
    imageUrl,
    descriptionUrl,
    likes,
    postId,
    userId
}) {
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    const tagStyle = {
        fontFamily: "Lato",
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "20px",
        letterSpacing: "0em",
        textAlign: "left",
        color: "#FAFAFA",
      };

    const [like, setLike] = useState(likes);
    const [isLiked, setIsLiked] = useState(false);

    const [animationState, setAnimationState] = useState({
        isStopped: false,
        isPaused: false,
        direction: -1,
    });
    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const normalAnimation = 1;
    const reverseAnimation = -1;
    const legendAlt = `${name} profile pic`;

    useEffect(() => {
        getLikes();
    }, []);

    async function getLikes() {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const { data: result } = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/like/${postId}`,
                config
            );

            if (result.isLiked === true) {
                setAnimationState({ ...animationState, direction: 1 });
            }
        } catch (e) {
            alert(
                "An error occured while trying to fetch the posts, please refresh the page"
            );

            console.log(e);
        }
    }

    function addLike() {
        setAnimationState({
            ...animationState,
            isStopped: false,
            direction: normalAnimation,
        });
        setLike(like + 1);
    }

    function removeLike() {
        setAnimationState({
            ...animationState,
            isStopped: true,
            direction: reverseAnimation,
        });

        setLike(like - 1);
    }

    function postLike() {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        if (animationState.direction === 1) {
            const promisse = axios
                .delete(`${process.env.URL}/like/${postId}`, config)

                .then(() => removeLike())

                .catch((e) => console.log(e));
        } else {
            const promisse = axios
                .post(`${process.env.URL}/like/${postId}`, {}, config)

                .then(() => addLike())

                .catch((e) => console.log(e));
        }
    }

    return (
        <Container key={key}>
            <ProfilePhoto>
                <img src={profileImage} alt={legendAlt} />
                <div className="animation" onClick={postLike}>
                    <Lottie
                        className="like"
                        options={defaultOptions}
                        height={65}
                        width={60}
                        direction={animationState.direction}
                        isStopped={animationState.isStopped}
                        isPaused={animationState.isPaused}
                    />
                </div>
                <h6>{like > 1 ? `${like} likes` : `${like} like`}</h6>
            </ProfilePhoto>
            <Post>
        <h3 onClick={()=>navigate(`/timeline/user/${userId}`)}>{name}</h3>
        <ReactTagify
          tagStyle={tagStyle}
          tagClicked={(tag) => {
            const tagWithoutHash= tag.replace("#","")
            navigate(`/hashtag/${tagWithoutHash}`)
          }}
        >
          <p>{text}</p>
        </ReactTagify>

        <LinkBox href={url} target="_blank">
          <div>
            <h4>{titleUrl}</h4>
            <h5>{descriptionUrl}</h5>
            <h6>{url}</h6>
          </div>
          <img src={imageUrl} alt="" />
        </LinkBox>
      </Post>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 17px;
    padding-right: 22px;
    margin-bottom: 30px;
    display: flex;
    font-family: "Lato";
    background-color: #171717;
    border-radius: 16px;
    h3 {
        color: white;
        font-size: 24px;
        margin-bottom: 8px;
    }
    p {
        color: #b7b7b7;
        font-size: 18px;
        line-height: 20px;
    }
`;
const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    img {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        object-fit: cover;
    }

    h6 {
        color: #b6b6b6;
        text-align: center;
    }
    div * {
        border-radius: 50px;
        cursor: pointer;
    }
`;

const Post = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
`;

const LinkBox = styled.a`
    width: 100%;
    margin-top: 20px;
    text-decoration: none;
    border: 1px solid #4d4d4d;
    border-radius: 12px;
    display: flex;
    div {
        padding: 24px 19px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    h4 {
        color: #cecece;
        font-size: 18px;
        line-height: 19px;
    }
    h5 {
        color: #9b9595;
        font-size: 14px;
        line-height: 16px;
    }
    h6 {
        color: #cecece;
        font-size: 11px;
        line-height: 13px;
    }
    img {
        width: 33%;
        height: calc(width);
        object-fit: fill;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
`;
