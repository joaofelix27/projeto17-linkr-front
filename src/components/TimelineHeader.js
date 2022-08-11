import styled from "styled-components";
import { IoChevronUp,IoChevronDown } from "react-icons/io5";
import OutsideClickHandler from 'react-outside-click-handler';
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";
import UserContext from "../contexts/UserContext";
import {DebounceInput} from 'react-debounce-input';
import SearchBox from "./SearchBox.js";

const notify = (error)=>{
    toast(`❗ ${error}`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

export default function TimelineHeader(){
    const [openMenu,setOpenMenu] = useState(false);
    const [users,setUsers] = useState([]);

    const { setToken,token,setImage,image,setName } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            notify('Unauthorized!');
            setTimeout(()=>{
                navigate('/');
            },1000)
        }
    },[users])

<<<<<<< HEAD

    },[])
    
=======
    function renderUsers(){
        console.log(1)
            const search = users.map(({picture,id,username,index}) =>
                <UserBox onClick={()=>navigate(`/timeline/user/${id}`)} key={index}>
                     <img src={picture} alt="" srcset="" />
                    <h4>{username}</h4>
                </UserBox>
            );
            return search;
    }

>>>>>>> 84457b2ecc235b06f95d6c71b27a45abce4fd0f8
    return(
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
                <h1>Linkr</h1>
                <DebounceInput 
                    element={SearchBox}
                    debounceTimeout={300}
                    setUsers={setUsers}
                />
                <UsersBox displayUsers={users}>
                {renderUsers()}
                </UsersBox>
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setOpenMenu(false);
                    }}
                    >
                    <div className="profile" >
                        {
                            openMenu ?
                            <IoChevronUp onClick={()=>setOpenMenu(!openMenu)} color="#ffffff" size={40} />
                                :
                            <IoChevronDown onClick={()=>setOpenMenu(!openMenu)} color="#ffffff" size={40} />
                        }
                        <img src={image} onClick={()=>setOpenMenu(!openMenu)} alt="" srcset="" />
                        <div className="logout" onClick={()=> {
                            localStorage.setItem('authToken', '');
                            setToken(localStorage.getItem('authToken'));
                            setImage('');
                            setName('');
                            navigate('/')
                        }}>
                            <h2>Logout</h2>
                        </div>
                    </div>       
                </OutsideClickHandler>
            </header>
        </Container>
    )
}

const UserBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 140px;
    margin-bottom: 20px;
    margin-left: 20px;

    h4{
        width: 100%;
    }

    img{
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 20px;
        object-fit: cover;
    }
`

const Container = styled.div`
    position: relative;
    header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #151515;
        min-height: 80px;
        height: 8vh;
        padding: 0 20px;
        position: relative;

        h1{
            color: #ffffff;
            font-family: 'Passion One';
            font-style: normal;
            font-weight: 700;
            font-size: 49px;
            line-height: 54px;
            letter-spacing: 0.05em;
        }

        .profile{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;

            img{
                width: 54px;
                height: 54px;
                border-radius: 50%;
                margin-left: 10px;
                object-fit: cover;
            }

            .logout{
                display: ${props => props.openMenu ? "flex" : "none"};
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
                padding-left:50px;

                h2{
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    font-size: 17px;
                    line-height: 20px;
                    letter-spacing: 0.05em;
                }
            }
        }
    }
`

const UsersBox = styled.div`
    display: ${props => props.displayUsers.length > 0 ? 'flex' : 'none !important'};
    flex-direction: column;
    width: 66%;
    height: 100px;
    position: absolute;
    bottom: -82px;
    padding: 14px;
    overflow-y: scroll;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: #E7E7E7;
`