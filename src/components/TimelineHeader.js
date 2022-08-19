import styled from "styled-components";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";
import OutsideClickHandler from "react-outside-click-handler";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import UserContext from "../contexts/UserContext";
import { DebounceInput } from "react-debounce-input";
import SearchBox from "./SearchBox.js";
import { Link } from "react-router-dom";

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

export default function TimelineHeader() {
  const [openMenu, setOpenMenu] = useState(false);

  const { setToken, token, setImage, image, setName } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      notify("Unauthorized!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, []);

  return (
    <Container openMenu={openMenu}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={true}
        limit={1}
      />
      <header>
        <Link to="/timeline" style={{textDecoration:'none'}}>
          <h1>Linkr</h1>
        </Link>
        <DebounceInput element={SearchBox} debounceTimeout={300} />
        <OutsideClickHandler
          onOutsideClick={() => {
            setOpenMenu(false);
          }}
        >
          <div className="profile">
            {openMenu ? (
              <IoChevronUp
                onClick={() => setOpenMenu(!openMenu)}
                color="#ffffff"
                size={40}
              />
            ) : (
              <IoChevronDown
                onClick={() => setOpenMenu(!openMenu)}
                color="#ffffff"
                size={40}
              />
            )}
            <img
              src={image}
              onClick={() => setOpenMenu(!openMenu)}
              alt=""
              srcset=""
            />
            <div
              className="logout"
              onClick={() => {
                localStorage.setItem("authToken", "");
                setToken(localStorage.getItem("authToken"));
                setImage("");
                setName("");
                navigate("/");
              }}
            >
              <h2>Logout</h2>
            </div>
          </div>
        </OutsideClickHandler>
      </header>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 4;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #151515;
    min-height: 80px;
    height: 8vh;
    padding: 0 20px;
    position: relative;

    svg{
      cursor: pointer;
    }

    h1 {
      color: #ffffff;
      font-family: "Passion One";
      font-style: normal;
      font-weight: 700;
      font-size: 49px;
      line-height: 54px;
      letter-spacing: 0.05em;
    }

    .profile {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      img {
        width: 54px;
        height: 54px;
        margin-top: 9px;
        border-radius: 50%;
        margin-left: 10px;
        object-fit: cover;
      }

      .logout {
        display: ${(props) => (props.openMenu ? "flex" : "none")};
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 46px;
        position: absolute;
        color: #ffffff;
        bottom: -40px;
        right: 0;
        background: #171717;
        border-radius: 0px 0px 20px 20px;
        padding-left: 20px;

        h2 {
          font-family: "Lato";
          font-style: normal;
          font-weight: 700;
          font-size: 17px;
          line-height: 20px;
          letter-spacing: 0.05em;
          cursor: pointer;
        }
      }
    }
  }
`;
