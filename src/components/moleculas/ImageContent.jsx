import { LazyLoadComponent } from "react-lazy-load-image-component";
import styled from "styled-components";
import { v } from "../../styles/variables";
import 'react-lazy-load-image-component/src/effects/blur.css';
export const ImageContent = ({ imagen }) => {
  return (
    <Container>
      <LazyLoadComponent
        placeholder={<v.iconoreact></v.iconoreact>}
        effect="blur"
        src={imagen}
        width={50}
        height={50}
      ></LazyLoadComponent>
    </Container>
  );
};

const Container = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10%;
  overflow: hidden;
  img {
    object-fit: cover;
  }
`;
