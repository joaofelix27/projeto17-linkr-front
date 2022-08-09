import styled from "styled-components";

export default function Header(){
    return(
    <Container>
        <header>
            <h1>linkr</h1>
            <h2>save, share and discover the best links on the web</h2>
        </header>
    </Container>
    );
}

const Container = styled.div`
    header{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background-color: #151515;
            width: 100%;
            height: 28vh;
            color: #ffffff;
            padding-left: 30px;
            padding-right: 30px;

            h1{
                font-weight: 700;
                font-size: 76px;
                line-height: 84px;
            }

            h2{
                font-weight: 700;
                font-size: 23px;
                line-height: 34px;
                text-align: center;
            }
        }
`