import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import repostimg from "../assets/repostIcon.png";
import Swal from 'sweetalert2'

import UserContext from "../contexts/UserContext";
import animationDataLike from "../assets/like-icon.json";
import animationDataDelete from "../assets/delete-icon.json";
import { ReactTagify } from "react-tagify";
import Comments from "./Comments";

import { Container, ProfilePhoto, Post, Textarea, LinkBox, ModalBox } from "./PostCard";

export default function RepostCard({
    key,
    name,
    profileImage,
    url,
    text,
    titleUrl,
    imageUrl,
    descriptionUrl,
    likes,
    comments,
    postId,
    creatorId,
    setPosts,
    getReposts,
    getTrending,
    reposts,
    reposter,
    reposterId
}) {
    const { token, userId, setUserId, setLoad, control, setControl } = useContext(UserContext);
    const [bodyValue, setBodyValue] = useState(text);
    const [reposterName, setReposterName] = useState(reposter);
    const [checkReposter, setCheckReposter] = useState(reposterId);
    const [originalBody, setOriginalBody] = useState(text);
    const [textEdit, setTextEdit] = useState(false);
    const [like, setLike] = useState(likes);
    const [comment, setComment] = useState(comments);
    const [repostsCount, setRepostsCount] = useState(reposts);
    const [show, setShow] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState("");
    const [isDisabled, setIsDisabled] = useState("");
    const [tooltip, setTooltip] = useState();
    const [showComments, setShowComments] = useState(false);
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


    function handleKeyPress(event) {
        if (event.key === "Escape") {
            setTextEdit(!textEdit);
        }
    }

    function findHashtags(searchText) {
        var regexp = /(\s|^)\#\w\w+\b/gm;
        let result = searchText.match(regexp);
        if (result) {
            result = result.map(function (s) {
                return s.trim();
            });
            return result;
        } else {
            return [];
        }
    }

    function removeDuplicates(arr) {
        const uniqueHashtag = arr.reduce(function (newArray, currentValue) {
            if (!newArray.includes(currentValue)) newArray.push(currentValue);
            return newArray;
        }, []);
        return uniqueHashtag;
    }

    function updateBody(e) {
        e.preventDefault();
        const hashtags = removeDuplicates(findHashtags(bodyValue));

        if (originalBody === bodyValue) {
            return setTextEdit(!textEdit);
        }

        setIsInputDisabled("disabled");

        const promisse = axios
            .put(
                `${process.env.REACT_APP_BASE_URL}/timeline/${postId}`,
                {
                    bodyValue,
                    hashtags,
                },
                config
            )
            .then(() => {
                setOriginalBody(bodyValue);
                setTextEdit(!textEdit);
                setIsInputDisabled("");
                getTrending();
            })
            .catch((e) => {
                setIsInputDisabled("");
                notify(e);
            });
    }

    function reloadPage() {
        getReposts();
        setIsDisabled("");
        setShow(false);
    }

    function removedPostSuccess(s) {
        setAnimationDeleteState({ ...animationDeleteState, isPaused: false });
        getTrending();
    }

    function error(e) {
        setAnimationDeleteState({ ...animationDeleteState, isPaused: true });
        setIsDisabled("");
        notify(e);
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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {tooltip}
        </Tooltip>
    );

    return (
        <>
            <Reposter>
                <img src={repostimg} alt="" srcset="" />
                Re-posted by {reposterId === creatorId ? 'you' : reposterName}
            </Reposter>
            <Container key={key} comments={showComments}>

                <ProfilePhoto>
                    <img src={profileImage} alt={legendAlt} />
                    <div className="animation">
                        <Lottie
                            options={likeDefaultOptions}
                            height={65}
                            width={60}
                            direction={animationLikeState.direction}
                            isStopped={animationLikeState.isStopped}
                        />
                    </div>
                    <OverlayTrigger placement="bottom" overlay={renderTooltip}>
                        <h6>{like > 1 ? `${like} likes` : `${like} like`}</h6>
                    </OverlayTrigger>
                    <div className="repost">
                        <img src={repostimg} alt="" srcset="" />
                        <h6>{repostsCount} re-posts</h6>
                    </div>
                    <div className="comment" onClick={() => setShowComments(!showComments)}>
                        <AiOutlineComment color="#fff" size={30} />
                        <h6>{comment} comments</h6>
                    </div>
                </ProfilePhoto>
                <Post>
                    <h3
                        onClick={() =>
                            navigate(`/timeline/user/${creatorId}`, setLoad(true), {
                                replace: true,
                                state: {},
                            })
                        }
                    >
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
            <Comments show={showComments} postId={postId} creatorId={creatorId} notify={notify} setComment={setComment}/>
        </>
    );
}

const Reposter = styled.div`
        display: flex;
        align-items: center;
        padding-left: 10px;
        height: 40px;
        width: 100%;
        color: #ffffff;
        background-color: #1E1E1E;
        margin-bottom: -11px;
        z-index: 2;
        img{
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }
`