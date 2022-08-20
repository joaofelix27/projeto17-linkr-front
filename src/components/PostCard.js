import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import Lottie from "react-lottie";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPencilAlt,  } from "react-icons/fa";
import {AiOutlineComment} from "react-icons/ai"
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import repostimg from "../assets/repostIcon.png";
import Swal from 'sweetalert2'

import UserContext from "../contexts/UserContext";
import animationDataLike from "../assets/like-icon.json";
import animationDataDelete from "../assets/delete-icon.json";
import { ReactTagify } from "react-tagify";
import Comments from "./Comments";

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
    comments,
    postId,
    creatorId,
    setPosts,
    getPosts,
    getTrending,
    reposts,
    isRepost,
    reposter,
    reposterId
}) {
    const { token, userId, setUserId, setLoad, control, setControl } = useContext(UserContext);
    const [bodyValue, setBodyValue] = useState(text);
    const [originalBody, setOriginalBody] = useState(text);
    const [textEdit, setTextEdit] = useState(false);
    const [like, setLike] = useState(likes);
    const [comment, setComment] = useState(comments);
    const [repostsCount,setRepostsCount] = useState(reposts);
    const [checkRepost,setCheckRepost] = useState(isRepost);
    const [reposterName,setReposterName] = useState(reposter);
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

    useEffect(() => {
        if (textEdit === true) {
            inputRef.current.focus();
        }

        getLikes(false);
    }, [textEdit]);

    async function getLikes(isReliked) {
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
            setTooltip(result?.tooltip);
            if (result.isLiked && !(isReliked)) {
                setAnimationLikeState({ ...animationLikeState, direction: 1 });
            }
        } catch (e) {
            notify(
                "An error occured while trying to fetch the posts, please refresh the page"
            );

            setTimeout(() => {
                navigate("/");
            }, 1000);

            console.log(e);
        }
    }

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

    function addLike() {
        setAnimationLikeState({
            ...animationLikeState,
            isStopped: false,
            direction: normalAnimation,
        });
        setLike(like + 1);
        setTooltip("Loading...");
        getLikes(true);
    }

    function removeLike() {
        setAnimationLikeState({
            ...animationLikeState,
            isStopped: true,
            direction: reverseAnimation,
        });

        setLike(like - 1);
        setTooltip("Loading...");
        getLikes();
    }

    function postLike() {
        if (animationLikeState.direction === 1) {
            const promisse = axios
                .delete(
                    `${process.env.REACT_APP_BASE_URL}/like/${postId}`,
                    config
                )

                .then(() => removeLike())

                .catch((e) => notify(e));
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
        getPosts()
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

    function repost(postId){
        Swal.fire({
            title: 'Do you want to re-post this link?',
            showCancelButton: true,
            confirmButtonText: 'Yes, share!',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: '#1877F2',
            cancelButtonColor: 'crimson',
            background:"#333333",
            color: "#ffffff",
            reverseButtons: true,
            height: "200px"
          }
        ).then((result) => {
            if (result.isConfirmed) {
                const promise = axios.post(`${process.env.REACT_APP_BASE_URL}/timeline/repost/${postId}`,{},config);

                promise.then(()=>{
                    Swal.fire({
                        title:"Reposted!",
                        background:"#333333",
                        color: "#ffffff"
                    });
                    setRepostsCount(parseInt(repostsCount)+1);
                    setControl(!control);
                });

                promise.catch(Error=>{
                    alert(Error.response.status);
                });
            } else{
                Swal.fire({
                    title:"Repost canceled!",
                    background:"#333333",
                    color: "#ffffff"
                });
                }
             });
    
        return;
    }

    return (
        <>
        <Container key={key} comments={showComments}>
            {
                !checkRepost ? 
                ""
                    :
                <Reposter>
                    <img src={repostimg} alt="" srcset="" />
                    Re-posted by {reposterId === creatorId ? 'you' : reposterName}
                </Reposter>
            }
            <ProfilePhoto>
                <img src={profileImage} alt={legendAlt} />
                <div className="animation" onClick={()=>{
                    if(checkRepost) return
                    postLike()
                    }}>
                    <Lottie
                        options={likeDefaultOptions}
                        height={60}
                        width={55}
                        direction={animationLikeState.direction}
                        isStopped={animationLikeState.isStopped}
                    />
                </div>
                <OverlayTrigger placement="bottom" overlay={renderTooltip}>
                    <h6>{like > 1 ? `${like} likes` : `${like} like`}</h6>
                </OverlayTrigger>
                <div className="repost" onClick={()=>{
                    if(checkRepost) return
                    repost(postId)
                    }}>
                    <img src={repostimg} alt="" srcset="" />
                    <h6>{repostsCount} re-posts</h6>
                </div>
                <div className="comment" onClick={()=> setShowComments(!showComments)}>
                    <AiOutlineComment color="#fff" size={30} />
                    <h6>{comment} comments</h6>
                </div>
            </ProfilePhoto>
            <Post>
            <div>
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
                </div>
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
        <Comments show={showComments} postId={postId} notify={notify} setComment={setComment}/>
        </>
    );
}

export const Container = styled.div`
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 17px;
    padding-right: 22px;
    margin-bottom: ${props => props.comments? "0px": "30px"};
    display: flex;
    font-family: "Lato";
    background-color: #171717;
    border-radius: 16px;
    word-wrap: break-word;
    position: relative;


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

    @media screen and (max-width: 650px) {
       padding: 14px;
       padding-right: 19px;
        h3{
        font-size: 20px;
       }
       p{
        font-size: 14px;
       }
    }
`;
export const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        object-fit: cover;
    }

    h6 {
        font-size: 13px;
        color: #b6b6b6;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 9px;
    }

    div * {
        border-radius: 50px;
        cursor: pointer;
    }

    .repost, .comment{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        img{
            height: 35px;
            width: 35px;
            margin-bottom: 7px;
        }
        h6{
            width: 70px;    
        }
    }
    @media screen and (max-width: 650px) {
        margin-right: 14px;
        width: 14%;
        img{
            width: 45px;
            height: 45px;
        }

    }
`;

export const Post = styled.div`
    width: 85%;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    position: relative;

    h3 {
        cursor: pointer;
    }

    span {
        span {
            cursor: pointer;
        }
    }

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
    @media screen and (max-width: 600px){
        padding-top: 6px;
    }
`;

export const LinkBox = styled.a`
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
        justify-content: space-between;
    }
    h4 {
        color: #cecece;
        font-size: 18px;
        line-height: 19px;
        margin-bottom: 10px;
    }
    h5 {
        color: #9b9595;
        font-size: 14px;
        line-height: 16px;
        margin-bottom: 6px;
    }
    h6 {
        color: #cecece;
        font-size: 11px;
        line-height: 13px;
    }
    img {
        max-width: 33%;
        height: auto;
        object-fit: fill;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
    @media screen and (max-width: 900px) {
        h4{
            font-size: 16px;
            margin-bottom: 4px;
        }
        h5{
            font-size: 14px;
            margin-bottom: 10px;
        }
        h6{
            font-size: 12px;
        }
        img {
            object-fit: cover;
        }
    }
    @media screen and (max-width: 650px) {
        margin-top: 13px;
        h4{
            max-height: 5.5ch;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            margin-bottom: 4px;
        }
        h5{
            max-height: 8.5ch;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 10px;
            margin-bottom: 4px
        }
        h6{
            font-size: 8px;
        }
        div{
            padding: 15px 12px;
        }

    }
`;

export const ModalBox = styled.div`
    background-color: black;
`;

export const Textarea = styled.input`
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
