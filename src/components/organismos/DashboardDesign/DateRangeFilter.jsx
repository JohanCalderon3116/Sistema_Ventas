import styled from "styled-components";
import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDashboardStore } from "../../../store/DashboardStore";
const { RangePicker } = DatePicker;
export const DateRangeFilter = () => {
  const [dates, setDates] = useState([
    dayjs("1900-01-01"),
    dayjs("9999-12-31"),
  ]);
  const [singleDate, setSingleDate] = useState(null);
  const [activeRange, setActiveRang] = useState("Todo");

  const { setRangoFechas, fechaInicio, fechaFin, limpiarFechas } =
    useDashboardStore();

  //Para mostrar todas las fechas
  const setSiempreRange = () => {
    const startDate = dayjs("1900-01-01");
    const endDate = dayjs("9999-12-31");
    setDates([startDate, endDate]);
    setActiveRang("Todo");
    setRangoFechas(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD"),
    );
  };

  const handleDateChange = (val) => {
    setDates(val || []);
    if (val) {
      setRangoFechas(val[0].format("YYYY-MM-DD"), val[1].format("YYYY-MM-DD"));
    }
  };

  const handleSingleDateChange = (date) => {
    setSingleDate(date);
    setDates([]);
    if (date) {
      setRangoFechas(date.format("YYYY-MM-DD"), date.format("YYYY-MM-DD"));
    }
    setActiveRang("Por día");
  };
  const selectToday = () => {
    const today = dayjs().startOf("day");
    setSingleDate(today);
    setDates([]);
    setRangoFechas(today.format("YYYY-MM-DD"), today.format("YYYY-MM-DD"));
    setActiveRang("Hoy");
  };
  //Funcion para establecer un rango predefinido
  const setPresetRange = (days, rangeName) => {
    const startDate = dayjs().subtract(days, "day").startOf("day");
    const endDate = dayjs().endOf("day");
    setDates([startDate, endDate]);
    setRangoFechas(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD"),
    );
    setActiveRang(rangeName);
  };
  useEffect(() => {
    setSiempreRange();
  }, []);
  return (
    <Container>
      <ButtonGroup>
        <TimeRangeButton
          onClick={setSiempreRange}
          isActive={activeRange === "Todo"}
        >
          Todo
        </TimeRangeButton>
        <TimeRangeButton
          onClick={() => setPresetRange(7, "7 días")}
          isActive={activeRange === "7 días"}
        >
          Últimos 7 días
        </TimeRangeButton>
        <TimeRangeButton
          onClick={() => setPresetRange(30, "30 días")}
          isActive={activeRange === "30 días"}
        >
          Últimos 30 días
        </TimeRangeButton>
        <TimeRangeButton
          onClick={() => setPresetRange(365, "12 meses")}
          isActive={activeRange === "12 meses"}
        >
          Últimos 12 meses
        </TimeRangeButton>
        <TimeRangeButton onClick={selectToday} isActive={activeRange === "Hoy"}>
          Hoy
        </TimeRangeButton>
        <TimeRangeButton
          onClick={() => setActiveRang("Por día")}
          isActive={activeRange === "Por día"}
        >
          Por día
        </TimeRangeButton>
        <TimeRangeButton
          onClick={() => {
            setDates([]);
            setSingleDate(null);
            limpiarFechas();
            setActiveRang("Rango");
          }}
          isActive={activeRange === "Limpiar"}
        >
          Limpiar
        </TimeRangeButton>
      </ButtonGroup>
      {(activeRange === "30 días" ||
        activeRange === "12 meses" ||
        activeRange === "7 días") && (
        <StyleRangePicker
          onChange={handleDateChange}
          value={dates}
        ></StyleRangePicker>
      )}
      {activeRange === "Por día" && (
        <StyleDatePicker onChange={handleSingleDateChange}></StyleDatePicker>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px;
`;

const ButtonGroup = styled.div``;

const TimeRangeButton = styled.button`
  color: ${({ theme }) => theme.text};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.bg2 : "transparent"};
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
`;
const StyleRangePicker = styled(RangePicker)`
  background-color: ${({ theme }) => theme.bg2};
  border: 2px dashed ${({ theme }) => theme.body};
  .ant-picker-input > input {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }
  .ant-picker-input input::placeholder {
    color: ${({ theme }) => theme.text};
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.text};
  }
  &:hover {
    background-color: ${({ theme }) => theme.body};
  }
  &:focus,
  &.ant-picker-focused {
    background-color: ${({ theme }) => theme.bg2};
  }
`;
const StyleDatePicker = styled(DatePicker)`
  background-color: ${({ theme }) => theme.bg2};
  border: 2px dashed ${({ theme }) => theme.body};
  .ant-picker-input > input {
    color: ${({ theme }) => theme.text};
    font-weight: bold;
  }
  .ant-picker-input input::placeholder {
    color: ${({ theme }) => theme.text};
  }

  .ant-picker-suffix {
    color: ${({ theme }) => theme.text};
  }
  &:hover {
    background-color: ${({ theme }) => theme.body};
  }
  &:focus,
  &.ant-picker-focused {
    background-color: ${({ theme }) => theme.bg2};
  }
`;
