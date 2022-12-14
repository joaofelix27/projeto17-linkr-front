import styled from "styled-components";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";

import UserContext from "../contexts/UserContext";

export default function SearchBox() {

  const { token } = useContext(UserContext);
  const [searchName, setSearchName] = useState("");
  const [users, setUsers] = useState([]);
  const { control, setControl, setLoad } = useContext(UserContext);
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

  const navigate = useNavigate();

  function renderUsers() {
    const search = users.map(({ picture, id, username, index, userid }) => (
      <UserBox
        onClick={() =>
          navigate(
            `/timeline/user/${id}`,
            setLoad(true),
            setControl(!control),
            { replace: true, state: {} }
          )
        }
        key={index}
      >
        <img src={picture} alt="" srcset="" />
        <h4>{username} </h4>
        <h3>{userid !== null ? "• following" : ""}</h3>
      </UserBox>
    ));
    return search;
  }

  function searchUser(event) {
    event.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const body = {
      name: searchName,
    };
    const promise = axios.post(
      `${process.env.REACT_APP_BASE_URL}/timeline/user`,
      body,
      config
    );

    promise.then((res) => {
      setUsers(res.data);
      setControl(!control);
    });

    promise.catch((Error) => {
      notify(Error.response.status);
    });
  }

  return (
    <Container displayUsers={users}>
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
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items:center;
  width: 100%;
  margin-bottom: 10px;
  margin-left: 5px;
  cursor: pointer;

  h3 {
    font-family: Lato;
    font-size: 19px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    color: #c5c5c5;
    margin-left:7px;
  }

  h4 {
    font-family: Lato;
    font-size: 19px;
    font-weight: 400;
    line-height: 23px;
    letter-spacing: 0em;
    color: #515151;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 611px;
  height: 46px;
  background-color: #ffffff;
  border-radius: ${props => props.displayUsers.length > 0? "6px 6px 0px 0px": "6px"};
  position: relative;

  form {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 650px;
    height: 46px;
    background-color: #ffffff;
    border-radius: 6px;
    position: relative;
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
  @media screen and (max-width: 1060px) {
    display: none;
  }
`;
