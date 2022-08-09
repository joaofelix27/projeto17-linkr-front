import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #333333;
    display: flex;
    flex-direction: column;

    .back{
        display: flex;
        align-items: center;
        justify-content: center;

        h1{
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            font-size: 17px;
            line-height: 20px;
            text-decoration-line: underline;
            color: #FFFFFF;
            margin-top: 18px;

            &:hover{
                cursor: pointer;
            }
        }
    }

    form{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 40px;

        input{
            background-color: #ffffff;
            padding-left: 12px;
            width: 86%;
            height: 8vh;
            margin-bottom: 12px;
            border-radius: 6px;
            border: none;
            font-size: 22px;

            &::placeholder{
                font-weight: 700;
                font-size: 22px;
                line-height: 33px;
                color:#9F9F9F;
            }
        }

        button{
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #1877F2;
            width: 86%;
            height: 8vh;
            border-radius: 6px;
            border: none;
            color: #ffffff;
            font-weight: 700;
            font-size: 22px;
            line-height: 33px;
        }
    }

    @media only screen and (min-width: 768px) {
        flex-direction: row;

        form{
            width: 80%;
            input{
                width: 90%;
            }

            button{
                width: 90%;
            }
        }

        .right{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 50%;
        }
    }
`