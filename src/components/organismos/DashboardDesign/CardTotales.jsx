import { Icon } from "@iconify/react";
import styled from "styled-components";
import { Device } from "../../../styles/breakpoints";

export const CardTotales = ({ title, icon, value, porcentage }) => {
  const isPositive = porcentage > 0;
  const isNeutral = porcentage === 0;
  return (
    <Container>
      <Title>
        <TitleText> {title} </TitleText>
        <Icon icon={icon} width="20" height="20"></Icon>
      </Title>
      <SalesValue> {value} </SalesValue>
      <Percentage isPositive={isPositive} isNeutral={isNeutral}>
        {" "}
        <Icon
          icon={
            isNeutral
              ? "akar-icons:minus"
              : isPositive
                ? "iconamoon:arrow-up-2-fill"
                : "iconamoon:arrow-down-2-fill"
          }
          width="16"
          height="16"
        ></Icon>
        {porcentage}% al periodo anterior
      </Percentage>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const TitleText = styled.span`
  margin-left: 0.1rem;
  color: ${({ theme }) => theme.colortitlecard};
  font-size: 18px;
  text-align: start;
`;
const SalesValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 5vw;
  line-height: 2.5rem;
  font-weight: bold;
  text-align: start;
  @media ${Device.tablet} {
    font-size: 1.8rem;
  }
`;
const Percentage = styled.span`
  color: ${(props) =>
    props.isNeutral ? "#6b7280" : props.isPositive ? "#616161" : "#d32f5b"};
  font-weight: 500;
  display: flex;
  align-items: start;
  font-size: 12px;
`;
