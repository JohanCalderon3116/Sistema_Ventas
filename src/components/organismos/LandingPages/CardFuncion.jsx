import styled from "styled-components";

export const CardFuncion = ({ top, bottom, left, right, title, imagen, bgcontentimagen, subtitle }) => {
  return (
    <Card $bottom={bottom} $top={top} $left={left} $right={right}>
      <CardIcon $bgcontentimagen={bgcontentimagen}>
        <img src={imagen} alt={title} />
      </CardIcon>
      <CardText>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardText>
    </Card>
  );
};

const Card = styled.div`
  width: 240px;
  min-height: 55px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.bgcards};
  border: 1px solid ${({ theme }) => theme.bgAlpha};
  border-radius: 14px;
  padding: 12px 16px;
  gap: 16px;
  position: absolute;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  
  top: ${(props) => props.$top};
  bottom: ${(props) => props.$bottom};
  left: ${(props) => props.$left};
  right: ${(props) => props.$right};
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: default;

  &:hover {
    transform: translateX(15px) scale(1.02);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    /* Se le da un tinte sutil en hover usando el color morado */
    border-color: ${({ theme }) => theme.carouselColor}50;
    z-index: 10;
  }
`;

const CardIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background-color: ${(props) => props.$bgcontentimagen};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }
`;

const CardText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CardTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colortitlecard};
  margin: 0;
  line-height: 1.2;
`;

const CardDescription = styled.p`
  font-size: 13px;
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colorSubtitle};
  font-weight: 500;
`;