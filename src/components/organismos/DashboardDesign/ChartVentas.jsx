import styled, { useTheme } from "styled-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import {
  FormatearNumeroDinero,
  FormatearNumeroDineroSinIsoYCurrency,
} from "../../../utils/Conversiones";
import { Icon } from "@iconify/react";
import {
  useDetalleVentasStore,
  useMostrarVentasAgrupadasXFechaQueryStack,
} from "../../..";
import { BarLoader } from "react-spinners";

export const ChartVentas = () => {
  const __theme = useTheme();
  const { ventasAgrupadasFecha, totalVentas, porcentajeCambioTotal } =
    useDetalleVentasStore();
  const isPositive = porcentajeCambioTotal > 0;
  const isNeutral = porcentajeCambioTotal === 0;
  const { isLoading } = useMostrarVentasAgrupadasXFechaQueryStack();
  if (isLoading) {
    return <BarLoader color={__theme.text} />;
  }

  return (
    <Container>
      <Header>
        <Title>Total ventas</Title>
      </Header>
      <MainInfo>
        <Revenue>{FormatearNumeroDineroSinIsoYCurrency(totalVentas)}</Revenue>
        <Change>
          <Percentage isPositive={isPositive} isNeutral={isNeutral}>
            <Icon
              width="22"
              height="22"
              icon={
                isNeutral
                  ? "lucide:minus"
                  : isPositive
                    ? "lucide:trending-up"
                    : "lucide:trending-down"
              }
            />
            {Math.abs(porcentajeCambioTotal).toFixed(1)}% al periodo anterior
          </Percentage>
        </Change>
      </MainInfo>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={500}
          height={400}
          data={ventasAgrupadasFecha}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={__theme.text} stopOpacity={0.28} />
              <stop offset="95%" stopColor={__theme.text} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeOpacity={0.12}
            stroke="#71717A"
            vertical={false}
          />
          <XAxis
            dataKey="fecha"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717A" }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            strokeWidth={2}
            type="monotone"
            dataKey="total_dia"
            stroke={__theme.text}
            fill="url(#colorValue)"
            dot={{
              r: 4,
              fill: __theme.text,
              stroke: __theme.bgcards,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: __theme.text,
              stroke: __theme.bgcards,
              strokeWidth: 2,
            }}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  const { dataempresa } = useEmpresaStore();
  if (active && payload && payload.length) {
    return (
      <TooltipContainer>
        <Date>{label}</Date>
        <Value>
          {FormatearNumeroDinero(
            payload[0].value,
            dataempresa?.currency,
            dataempresa?.iso,
          )}
        </Value>
      </TooltipContainer>
    );
  }
};

const Container = styled.div``;

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

const Value = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-top: 16px;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 0;
`;

const MainInfo = styled.div`
  margin: 10px 0 20px;
  padding-left: 20px;
`;

const Revenue = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`;

const Change = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
`;

const Percentage = styled.span`
  display: flex;
  text-align: center;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: ${(props) =>
    props.isNeutral ? "#71717A" : props.isPositive ? "#10b981" : "#ef4444"};
`;
