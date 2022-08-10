import styled from "styled-components";
import { ReactTagify } from "react-tagify";
import { useNavigate } from "react-router-dom";

export default function PostCard({
  key,
  name,
  profileImage,
  url,
  text,
  titleUrl,
  imageUrl,
  descriptionUrl,
  userId
}) {
  const navigate = useNavigate();
  const tagStyle = {
    fontFamily: "Lato",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "20px",
    letterSpacing: "0em",
    textAlign: "left",
    color: "#FAFAFA",
  };
  return (
    <Container key={key}>
      <ProfilePhoto>
        <img src={profileImage} alt="" />
      </ProfilePhoto>
      <Post>
        <h3 onClick={()=>navigate(`/timeline/user/${userId}`)}>{name}</h3>
        <ReactTagify
          tagStyle={tagStyle}
          tagClicked={(tag) => {
            const tagWithoutHash= tag.replace("#","")
            navigate(`/hashtag/${tagWithoutHash}`)
          }}
        >
          <p>{text}</p>
        </ReactTagify>

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
}

const Container = styled.div`
  width: 100%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 17px;
  padding-right: 22px;
  margin-bottom: 30px;
  display: flex;
  font-family: "Lato";
  background-color: #171717;
  border-radius: 16px;
  h3 {
    color: white;
    font-size: 24px;
    margin-bottom: 8px;
  }
  p {
    color: #b7b7b7;
    font-size: 18px;
    font-weight: 400;
    line-height: 20px;
  }
  
 @media only screen and (max-width: 720px) {
        width: 100%;
        height: 100%;
   }
`;

const ProfilePhoto = styled.div`
  height: 100%;
  margin-right: 20px;
  img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Post = styled.div`

    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 10px;

    @media only screen and (max-width: 720px) {
        height: 100%;
        flex-wrap: wrap;
    }

    @media only screen and (max-width: 400px) {
        margin-right: 0;
    }
`


const LinkBox = styled.a`
  width: 100%;
  margin-top: 20px;
  text-decoration: none;
  border: 1px solid #4d4d4d;
  border-radius: 12px;
  display: flex;
  div {
    padding: 24px 19px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  h4 {
    color: #cecece;
    font-size: 18px;
    line-height: 19px;
  }
  h5 {
    color: #9b9595;
    font-size: 14px;
    line-height: 16px;
  }
  h6 {
    color: #cecece;
    font-size: 11px;
    line-height: 13px;
  }
  img {
    width: 33%;
    height: calc(width);
    object-fit: fill;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  @media only screen and (max-width: 720px) {
        flex-wrap: wrap;
        padding-right: 0;
        margin-right: 0;
    }
`;

