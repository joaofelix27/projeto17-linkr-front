import styled from "styled-components";
import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import UserContext from "../contexts/UserContext";

export default function SendPostCard({ getPosts,getTrending }) {
    const { image, token } = useContext(UserContext);
    const [link, setLink] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
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
            if (!newArray.includes(currentValue))
                newArray.push(currentValue);
            return newArray;
        }, []);
        return uniqueHashtag;
    }

    async function publish(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const hashtags = removeDuplicates(findHashtags(body));

            const post = {
                link,
                body,
                hashtags: hashtags,
            };
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(
                `${process.env.REACT_APP_BASE_URL}/timeline/create`,
                post,
                config
            );
            await getPosts();
            await getTrending();
            setLoading(false);
            setLink("");
            setBody("");
        } catch (e) {
            notify("Houve um erro ao publicar seu link");
            console.log(e);
            setLoading(false);
        }
    }

    function contentButton() {
        if (loading) {
            return "Publishing...";
        }
        return "Publish";
    }

    return (
        <Container>
            <ProfilePhoto>
                <img src={image} alt="" />
            </ProfilePhoto>
            <form onSubmit={publish}>
                <h3>What are you going to share today?</h3>

                <input
                    type="url"
                    placeholder="http://"
                    required
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                    disabled={loading}
                />

                <Textarea
                    name="text"
                    rows="14"
                    cols="10"
                    wrap="soft"
                    placeholder="Awesome article about #javascript"
                    required
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    disabled={loading}
                >
                    {" "}
                </Textarea>

                <ButtonBox>
                    <Button disabled={loading}>{contentButton()}</Button>
                </ButtonBox>
            </form>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    background-color: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 17px;
    padding-right: 22px;
    margin-bottom: 30px;
    display: flex;
    font-family: Lato;
    h3 {
        font-weight: 300 !important;
        font-size: 24px;
        line-height: 24px;
        margin-bottom: 10px;
        color: #707070 !important;
    }
    form {
        padding-top: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    input {
        border: none;
        border-radius: 5px;
        background-color: #efefef;
        width: 100%;
        margin-bottom: 5px;
        height: 30px;
        padding: 5px;
        ::placeholder {
            font-family: "Lato";
            color: #949494;
            font-weight: 300;
            font-size: 15px;
        }
    }

    .text {
        display: flex;
        padding-bottom: 70px;
        height: 100px;
    }

    @media only screen and (max-width: 720px) {
        width: 100%;
        h3{
            font-size: 22px;
        }
    }
`;

const Button = styled.button`
    color: white;
    font-weight: 700;
    border: none;
    background-color: #1877f2;
    width: 115px;
    height: 32px;
    border-radius: 5px;
    opacity: ${(props) => (props.disabled ? "70%" : "100%")};
`;

const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    img {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        margin-right: 3px;
        object-fit: cover;
    }
    @media screen and (max-width: 650px) {
      display: none;
    }
`;

const ButtonBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
`;

const Textarea = styled.textarea`
    border: none;
    border-radius: 5px;
    background-color: #efefef;
    width: 100%;
    margin-bottom: 5px;
    height: 100px;
    padding: 5px;
    padding-bottom: 70px;
    ::placeholder {
        font-family: "Lato";
        color: #949494;
        font-weight: 300;
        font-size: 15px;
    }
`;
