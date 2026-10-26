import styled, { useTheme } from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ConvertirCapitalize } from "../../../utils/Conversiones";
import { BarLoader } from "react-spinners";
import { Lottieanimation } from "../../atomos/Lottieanimation";
import animacionvacio from "../../../assets/vacioanimation.json.json";
import { useMostrarTop5MasVendidosXCantidadQueryStack } from "../../../tanstack/VentasStack";

export const ChartProductosTop5 = () => {
  const __theme = useTheme();
  const { data, isLoading } = useMostrarTop5MasVendidosXCantidadQueryStack();
  if (isLoading) {
    return <BarLoader color={__theme.text} />;
  }

  return (
    <Container>
      <Header>
        <Title>Top 5</Title>
        <Subtitle>Productos por cantidad vendida</Subtitle>
      </Header>
      {data && data.length > 0 ? (
        <>
          {data?.map((item, index) => {
            return (
              <Row key={index}>
                <NameContent>
                  <Name>{ConvertirCapitalize(item.nombre_producto)}</Name>
                </NameContent>
                <Stats>{item.total_vendido}</Stats>
                <Percentage>{item.porcentaje} %</Percentage>
              </Row>
            );
          })}
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{
                top: 15,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeOpacity={0.12}
                stroke="#71717A"
                vertical={false}
              />
              <XAxis
                dataKey="nombre_producto"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#71717A" }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                strokeWidth={1.5}
                type="monotone"
                dataKey="total_vendido"
                fill={__theme.text}
                activeDot={{ r: 6 }}
                fillOpacity={0.88}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Lottieanimation animacion={animacionvacio} alto="200" ancho="200" />
      )}
    </Container>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <Date>{ConvertirCapitalize(label)} </Date>
        <Value>Cant: {payload[0].value}</Value>
      </TooltipContainer>
    );
  }
};

const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 13px;
  color: ${({ theme }) => theme.text};
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const Percentage = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.color2};
`;

const NameContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 2;
`;

const Name = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 4px 0 0;
`;

const Container = styled.div`
  padding: 20px;
`;

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.bgcards};
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 12px;
  border: 1px solid ${({ theme }) => theme.color2};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
`;

const Date = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colorSubtitle};
`;

const Header = styled.div`
  margin-bottom: 16px;
  text-align: left;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;
