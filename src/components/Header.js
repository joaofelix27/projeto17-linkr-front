import styled from "styled-components";

export default function Header() {
    return (
        <Container>
            <header>
                <h1>linkr</h1>
                <h2>save, share and discover the best links on the web</h2>
            </header>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    header {
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

        h1 {
            font-family: "Passion One";
            font-style: normal;
            font-weight: 700;
            font-size: 76px;
            line-height: 84px;
            letter-spacing: 0.05em;
        }

        h2 {
            font-family: "Oswald", sans-serif;
            font-weight: 700;
            font-size: 23px;
            line-height: 34px;
            text-align: center;
        }
    }

    @media only screen and (min-width: 768px) {
        width: 50%;
        header {
            min-height: 100vh;
            justify-content: flex-start;
            align-items: flex-start;

            h1 {
                margin-top: 40vh;
                margin-left: 20%;
            }
            h2 {
                width: 60%;
                margin-left: 20%;
                text-align: start;
            }
        }
    }
`;
