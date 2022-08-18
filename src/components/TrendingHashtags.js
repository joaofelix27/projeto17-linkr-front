import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function TrendingHashtags({ hashtags }) {
    const navigate = useNavigate();


    function Hashtags() {
        if (hashtags) {
            const trendings = hashtags.map((value, index) => {
                return (
                    <Hashtags1
                        key={index}
                        onClick={() => {
                            navigate(`/hashtag/${value?.name}`);
                        }}
                    >
                        # {value?.name}{" "}
                    </Hashtags1>
                );
            });
            return trendings;
        }
    }
    const hashtagTrending = Hashtags();
    return (
        <Container>
            <h2>Trending</h2>
            <Border></Border>
            {hashtagTrending}
        </Container>
    );
}
const Container = styled.div`
    padding-top: 10px;
    position: sticky;
    top: 100px;
    height: 406px;
    width:100%;
    min-width:250px;
    max-width:301px;
    border-radius: 16px;
    background-color: #171717;
    h2 {
        font-family: Oswald;
        font-size: 27px;
        font-weight: 700;
        line-height: 40px;
        letter-spacing: 0em;
        color: #ffffff;
        margin-left: 16px;
    }
    h3{
        cursor: pointer;
    }
`;

const Border = styled.div`
    margin-top: 12px;
    margin-bottom: 22px;
    border: 1px solid #484848;
`;
const Hashtags1 = styled.h3`
    font-family: Lato;
    font-size: 19px;
    font-weight: 700;
    line-height: 23px;
    letter-spacing: 0.05em;
    margin-bottom: 7px;
    margin-left: 16px;
    color: #ffffff;
`;
