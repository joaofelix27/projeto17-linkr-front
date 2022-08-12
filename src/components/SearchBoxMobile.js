import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";

export default function SearchBoxMobile() {
    const [searchName, setSearchName] = useState("");
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    function renderUsers() {
        const search = users.map(({ picture, id, username, index }) => (
            <UserBox
                onClick={() => navigate(`/timeline/user/${id}`)}
                key={index}
            >
                <img src={picture} alt="" srcset="" />
                <h4>{username}</h4>
            </UserBox>
        ));
        return search;
    }

    function searchUser(event) {
        event.preventDefault();

        const body = {
            name: searchName,
        };

        const promise = axios.post(
            `${process.env.REACT_APP_BASE_URL}/timeline/user`,
            body
        );

        promise.then((res) => {
            setUsers(res.data);
        });

        promise.catch((Error) => {
            alert(Error.response.status);
        });
    }

    return (
        <Container>
            <form>
                <input
                    type="text"
                    placeholder="Search for people"
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        if (searchName.length >= 3) {
                            searchUser(e);
                        } else {
                            setUsers([]);
                        }
                    }}
                />
                <IoSearch type="submit" color="#333333" size={30} />
            </form>
            <UsersBox displayUsers={users}>{renderUsers()}</UsersBox>
        </Container>
    );
}

const UsersBox = styled.div`
    display: ${(props) =>
        props.displayUsers.length > 0 ? "flex" : "none !important"};
    flex-direction: column;
    width: 100%;
    height: 130px;
    position: absolute;
    bottom: -130px;
    padding: 14px;
    overflow-y: scroll;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: #e7e7e7;

    @media screen and (max-width:1060px) {
        padding-top: 8px;
        height: 64px;
        bottom: -64px;
    }
`;

const UserBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 140px;
    margin-bottom: 10px;
    margin-left: 20px;

    h4 {
        width: 100%;
    }

    img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 20px;
        object-fit: cover;
    }
`;

const Container = styled.div`
    display: none;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 46px;
    background-color: #ffffff;
    border-radius: 6px 6px 0px 0px;
    position: relative;

    form {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 12px;
        input {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 6px;
            font-size: 20px;
            &:focus {
                outline: none;
            }
        }
    }

    @media screen and (max-width:1060px) {
        display: flex;
    }
`;