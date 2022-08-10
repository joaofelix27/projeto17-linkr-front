import styled from "styled-components";

export default function PostCard({ key, name, profileImage, url, text, titleUrl, imageUrl, descriptionUrl }) {
    return (
        <Container key={key}>
            <ProfilePhoto>
                <img src={profileImage} alt="" />
            </ProfilePhoto>
            <Post>
                <h3>{name}</h3>
                <h4>{text}</h4>

                <LinkBox href={url} target="_blank">
                    <div>
                        <h4>{titleUrl}</h4>
                        <h5>{descriptionUrl}</h5>
                        <h6>{url}</h6>
                    </div>
                    <img src={imageUrl} alt="" />
                </LinkBox>
            </Post>
        </Container>
    );
};

const Container = styled.div`
    width: 720px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    padding: 17px;
    padding-right: 22px;
    margin-bottom: 30px;
    display: flex;
    font-family: 'Lato';
    width: 720px;
    background-color: #171717;
    border-radius: 16px;
    h3{
        color: white;
        font-size: 24px;
        margin-bottom: 8px;
    }
    h4{
        color: #B7B7B7;
        font-size: 18px;
        line-height: 20px;
    }
`
const ProfilePhoto = styled.div`
    height: 100%;
    margin-right: 20px;
    img{
        width: 58px;
        height: 58px;
        border-radius: 50%;
        object-fit: cover;
    }
`

const Post = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
`

const LinkBox = styled.a`
    width: 100%;
    margin-top: 20px;
    text-decoration: none;
    border: 1px solid #4D4D4D;
    border-radius: 12px;
    display: flex;
    div{
        padding: 24px 19px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    h4{
        color: #CECECE;
        font-size: 18px;
        line-height: 19px;
    }
    h5{
        color: #9B9595;
        font-size: 14px;
        line-height: 16px;
    }
    h6{
        color: #CECECE;
        font-size: 11px;
        line-height: 13px;
    }
    img{
        width: 33%;
        height: calc(width);
        object-fit: fill;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
`