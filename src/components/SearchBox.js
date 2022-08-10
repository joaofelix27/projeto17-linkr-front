import styled from "styled-components";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "axios";

export default function SearchBox({setUsers}){
    const [searchName,setSearchName] = useState('');

    function searchUser(event){
        event.preventDefault();

        const body = {
            name:searchName
        }
    
        const promise = axios.post('https://projeto17-linkr-api2.herokuapp.com/timeline/user',body);

        promise.then((res)=>{
            console.log(res.data);
            setUsers(res.data);
        });

        promise.catch(Error=>{
            alert(Error.response.status)
        })
    }

    return(
        <Container>
            <form>
                <input type="text"
                    placeholder="Search for people"
                    value={searchName}
                    onChange={(e)=>{
                        setSearchName(e.target.value);
                        if(searchName.length > 2){
                            searchUser(e);
                        }else{
                            setUsers([]);
                        }
                    }}
                />
                <IoSearch type="submit" color="#333333" size={30} />
            </form>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 46px;
    background-color: #ffffff;
    border-radius: 6px;
    position: relative;

    form{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 12px;
        input{
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 6px;
            font-size: 20px;
            &:focus{
                outline: none;
            }
        }
    }
`
