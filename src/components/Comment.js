import styled from "styled-components";

export default function Comment({ name, profileImg, text }) {
    return (
        <>
            <Container>
                <img src={profileImg} alt="" />
                <div>
                    <h1>{name}</h1>
                    <h6>{text}</h6>
                </div>
            </Container>
            <Bar/>
        </>
    );
};

const Container = styled.div`
    display: flex;
    margin: 23px 0px;
    h1{
        color: #F3F3F3;
        font-weight: 700;
        font-size: 17px;
        margin-bottom: 8px;
    }
    h6{
        color: #ACACAC;
        font-weight: 400;
        font-size: 15px;
    }
    img{
        margin-right: 20px;
    }
`;

const Bar = styled.div`
    background-color: white;
    width: 100%;
    border: 1px solid #353535;
`;