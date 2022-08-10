import styled from "styled-components";



import TimelineHeader from "../components/TimelineHeader";
import PostCard from "../components/PostCard";

export default function Timeline() {

    return(
    <Container>
        <TimelineHeader/>
        
        <Content>
            <h2>timeline</h2>
            <PostCard/>
        </Content>
        
    </Container>
    );
};

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #333333;
    
    h2{
        width: 720px;
        margin: 50px 0px;
        font-weight: 700;
        font-size: 43px;
        color: white;
    }

`
const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
`