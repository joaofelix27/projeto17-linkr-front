import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import UserContext from "../contexts/UserContext";
import animationDataLike from "../assets/like-icon.json";
import animationDataDelete from "../assets/delete-icon.json";
import { ReactTagify } from "react-tagify";

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
    creatorId,
    setPosts,
}) {
    const { token, userId, setUserId, setImage, setName } =
        useContext(UserContext);
    const [bodyValue, setBodyValue] = useState(text);
    const [originalBody, setOriginalBody] = useState(text);
    const [textEdit, setTextEdit] = useState(false);
    const [like, setLike] = useState(likes);
    const [show, setShow] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState("");
    const [isDisabled, setIsDisabled] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef();
    const handleClose = () => setShow(false);
    const toggleEditing = () => {
        setTextEdit(!textEdit);
    };
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const tagStyle = {
        fontFamily: "Lato",
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "20px",
        letterSpacing: "0em",
        textAlign: "left",
        color: "#FAFAFA",
    };
    const [animationLikeState, setAnimationLikeState] = useState({
        isStopped: false,
        isPaused: false,
        direction: -1,
    });
    const likeDefaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationDataLike,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const [animationDeleteState, setAnimationDeleteState] = useState({
        isStopped: false,
        isPaused: false,
        direction: 1,
        speed: 0.09,
        eventListeners: [
            {
                eventName: "complete",
                callback: reloadPage,
            },
        ],
    });

    const deleteDefaultOptions = {
        loop: false,
        autoplay: false,
        animationData: animationDataDelete,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
        eventListeners: [
            {
                eventName: "complete",
                callback: () => console.log("the animation completed:"),
            },
        ],
    };

    const normalAnimation = 1;
    const reverseAnimation = -1;
    const legendAlt = `${name} profile pic`;

    useEffect(() => {
        if (textEdit === true) {
            inputRef.current.focus();
        }

        getLikes();
    }, [textEdit]);

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
            setUserId(result?.userId);
            if (result.isLiked === true) {
                setAnimationLikeState({ ...animationLikeState, direction: 1 });
            }
        } catch (e) {
            alert(
                "An error occured while trying to fetch the posts, please refresh the page"
            );

            console.log(e);
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Escape") {
            setTextEdit(!textEdit);
        }
    }

    function updateBody(e) {
        e.preventDefault();


        if (originalBody === bodyValue) {
           return setTextEdit(!textEdit);
        }

        setIsInputDisabled("disabled");

        const promisse = axios
            .put(
                `${process.env.REACT_APP_BASE_URL}/timeline/${postId}`,
                {
                    bodyValue,
                },
                config
            )
            .then(() => {
                setOriginalBody(bodyValue);
                setTextEdit(!textEdit)
                setIsInputDisabled('');
            })
            .catch((e) => {
                setIsInputDisabled('');
                alert(e);
            });
    }

    function addLike() {
        setAnimationLikeState({
            ...animationLikeState,
            isStopped: false,
            direction: normalAnimation,
        });
        setLike(like + 1);
    }

    function removeLike() {
        setAnimationLikeState({
            ...animationLikeState,
            isStopped: true,
            direction: reverseAnimation,
        });

        setLike(like - 1);
    }

    function postLike() {
        if (animationLikeState.direction === 1) {
            const promisse = axios
                .delete(
                    `${process.env.REACT_APP_BASE_URL}/like/${postId}`,
                    config
                )

                .then(() => removeLike())

                .catch((e) => console.log(e));
        } else {
            const promisse = axios
                .post(
                    `${process.env.REACT_APP_BASE_URL}/like/${postId}`,
                    {},
                    config
                )

                .then(() => addLike())

                .catch((e) => console.log(e));
        }
    }

    function reloadPage() {
        getPosts();
        setIsDisabled("");
        setShow(false);
    }

    function removedPostSuccess(s) {
        setAnimationDeleteState({ ...animationDeleteState, isPaused: false });
    }

    function error(e) {
        setAnimationDeleteState({ ...animationDeleteState, isPaused: true });
        setIsDisabled("");
        alert(e);
    }

    function removePost() {
        setIsDisabled("disabled");

        const promisse = axios
            .delete(
                `${process.env.REACT_APP_BASE_URL}/timeline/${postId}`,
                config
            )
            .then(() => removedPostSuccess())
            .catch((e) => error(e));
    }

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
            alert(
                "An error occured while trying to fetch the posts, please refresh the page"
            );
            console.log(e);
        }
    }
    return (
        <Container key={key}>
            <ProfilePhoto>
                <img src={profileImage} alt={legendAlt} />
                <div className="animation" onClick={postLike}>
                    <Lottie
                        options={likeDefaultOptions}
                        height={65}
                        width={60}
                        direction={animationLikeState.direction}
                        isStopped={animationLikeState.isStopped}
                    />
                </div>
                <h6>{like > 1 ? `${like} likes` : `${like} like`}</h6>
            </ProfilePhoto>
            <Post>
                <h3 onClick={() => navigate(`/timeline/user/${creatorId}`)}>
                    {name}
                </h3>
                {textEdit === false ? (
                    <ReactTagify
                        tagStyle={tagStyle}
                        tagClicked={(tag) => {
                            const tagWithoutHash = tag.replace("#", "");
                            navigate(`/hashtag/${tagWithoutHash}`);
                        }}
                    >
                        <p>{originalBody}</p>
                    </ReactTagify>
                ) : (
                    <form onSubmit={(e) => updateBody(e)}>
                        <Textarea
                            type="text"
                            ref={inputRef}
                            placeholder="Awesome article about #javascript"
                            onChange={(e) => setBodyValue(e.target.value)}
                            value={bodyValue}
                            disabled={isInputDisabled}
                            onKeyUpCapture={(e) => handleKeyPress(e)}
                            required
                        />
                    </form>
                )}
                {creatorId === userId ? (
                    <div className="buttons">
                        <FaPencilAlt
                            color="#fff"
                            onClick={() => setTextEdit(!textEdit)}
                        />
                        <FaTrash color="#fff" onClick={() => setShow(true)} />
                    </div>
                ) : null}

                <LinkBox href={url} target="_blank">
                    <div>
                        <h4>{titleUrl}</h4>
                        <h5>{descriptionUrl}</h5>
                        <h6>{url}</h6>
                    </div>
                    <img src={imageUrl} alt={titleUrl} />
                </LinkBox>
            </Post>
            <ModalBox>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header>
                        <Modal.Body>
                            <Lottie
                                options={deleteDefaultOptions}
                                height={50}
                                width={55}
                                direction={animationDeleteState.direction}
                                isStopped={animationDeleteState.isStopped}
                                isPaused={animationDeleteState.isPaused}
                                speed={0.5}
                                eventListeners={
                                    animationDeleteState.eventListeners
                                }
                            />
                            Are you sure you want to delete this post?
                        </Modal.Body>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button
                            disabled={isDisabled}
                            variant="secondary"
                            onClick={() => setShow(false)}
                        >
                            No, go back
                        </Button>
                        <Button
                            disabled={isDisabled}
                            variant="primary"
                            onClick={removePost}
                        >
                            Yes, delete it
                        </Button>
                    </Modal.Footer>
                </Modal>
            </ModalBox>
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
    position: relative;

    .buttons {
        position: absolute;
        top: 0;
        right: 0;

        svg {
            cursor: pointer;
            width: 30px;
            margin-left: 5px;
            height: 18px;
        }
    }
`;

const LinkBox = styled.a`
    width: 100%;
    margin-top: 20px;
    text-decoration: none;
    border: 1px solid #4d4d4d;
    border-radius: 12px;
    display: flex;
    word-break: break-word;
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
        object-fit: contain;
    }

    @media screen and (max-width: 1300px){
        flex-wrap: wrap;

        img{
            width: 60%;
            margin: 0 auto;
            border-radius: 0;
        }
    }

    @media screen and (max-width: 1050px){
        img{
            width: 60%;
            margin: 0 auto;
            border-radius: 0;
        }
    }

    @media screen and (max-width: 500px){
        img{
            width: 70%;
            margin: 0 auto;
            border-radius: 0;
        }
    }
`;

const ModalBox = styled.div`
    background-color: black;
`;

const Textarea = styled.input`
    border: none;
    border-radius: 5px;
    background-color: #efefef;
    width: 100%;
    margin-bottom: 5px;
    height: fit-content;
    padding: 5px;
    font-size: 20px;
    ::placeholder {
        font-family: "Lato";
        color: #949494;
        font-weight: 300;
        font-size: 15px;
    }
`;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#333333",
        boxSizing: "border-box",
        padding: "130px",
    },
};
