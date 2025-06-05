import React from 'react';
import styled from '@emotion/styled';

// Import images
import cloud1 from '../../assets/images/cloud/cloud1.png';
import cloud2 from '../../assets/images/cloud/cloud2.png';
import cloud3 from '../../assets/images/cloud/cloud3.png';
import cloud4 from '../../assets/images/cloud/cloud4.png';
import cloud5 from '../../assets/images/cloud/cloud5.png';
import forestBG from '../../assets/images/cloud/gothamCity.webp';

// Styled components
const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Container1 = styled.div`
  background-image: url(${forestBG});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 60%;
  position: relative;

  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    color: white;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

const Cloud = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;

  img {
    animation: cld calc(8s * var(--i)) linear infinite;
    opacity: 0.6;
    max-width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  @keyframes cld {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const Container2 = styled.div`
  width: 50%;
  margin: 20px auto;

  h4 {
    text-align: center;
    color: gray;
    font-size: 18px;
    padding-top: 20px;
  }

  p {
    color: rgb(151, 151, 151);
    font-size: 14px;
    line-height: 25px;
    padding-top: 20px;
  }
`;

// Global styles
const GlobalStyle = styled.div`
  * {
    margin: 0;
    padding: 0;
    font-family: 'Lato', sans-serif;
  }
`;

const HomeSecret = () => {
  const clouds = [
    { src: cloud1, i: 1 },
    { src: cloud2, i: 2 },
    { src: cloud3, i: 3 },
    { src: cloud4, i: 4 },
    { src: cloud5, i: 5 }
  ];

  return (
    <GlobalStyle>
      <Container>
        <Container1>
          <Cloud>
            {clouds.map((cloud, index) => (
              <img key={index} src={cloud.src} alt={`cloud ${index + 1}`} style={{ '--i': cloud.i }} />
            ))}
          </Cloud>
        </Container1>
        {/* <Container2>
          <h4>CSS Cloud Animation Effect</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged. It was popularised in 
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including 
            versions of Lorem Ipsum.
          </p>
        </Container2> */}
      </Container>
    </GlobalStyle>
  );
};

export default HomeSecret;
