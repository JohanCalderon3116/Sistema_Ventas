import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePermisosStore } from "../../index";
import { fadeUp, reducedMotion } from "../../utils/animations";

export function ConfiguracionesTemplate() {
  const { dataPermisosConfiguraciones } = usePermisosStore();
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.querySelectorAll(".card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };
    const cardsContainer = document.getElementById("cards");
    if (cardsContainer) {
      cardsContainer.addEventListener("mousemove", handleMouseMove);
      return () => {
        cardsContainer.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <Container>
      <div id="cards">
        {dataPermisosConfiguraciones?.map((item, index) => {
          return (
            <Link
              to={item.modulos.link}
              className={item.modulos.state ? "card" : "card false"}
              key={index}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-content">
                <div className="card-image">
                  <img src={item.modulos.icono} alt={item.modulos.nombre} />
                </div>
                <div className="card-info-wrapper">
                  <div className="card-info">
                    <div className="card-info-title">
                      <h3>{item.modulos.nombre}</h3>
                      <h4>{item.modulos.descripcion}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.bgtotal};
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100%;
  align-items: flex-start;
  overflow-y: auto;
  ${reducedMotion}
  #cards {
    position: relative;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    max-width: 980px;
    width: 100%;
    padding: 28px 20px;
    justify-content: center;
  }
  #cards:hover > .card::after {
    opacity: 1;
  }
  .card {
    background-color: ${({ theme }) => theme.color2};
    border: 1px solid ${({ theme }) => theme.color2};
    border-radius: 14px;
    cursor: pointer;
    display: flex;
    height: 250px;
    flex-direction: column;
    position: relative;
    width: 300px;
    animation: ${fadeUp} 0.35s ease-out both;
    transition: transform 0.2s ease-out, border-color 0.2s ease-out;
    &:hover {
      transform: translateY(-2px);
      border-color: rgba(139, 92, 246, 0.35);
      .card-image {
        img {
          filter: grayscale(0);
        }
      }
    }
  }
  .card:hover::before {
    opacity: 1;
  }
  .card::before,
  .card::after {
    border-radius: inherit;
    content: "";
    height: 100%;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    transition: opacity 400ms;
    width: 100%;
  }
  .card::before {
    background: radial-gradient(
      600px circle at var(--mouse-x) var(--mouse-y),
      rgba(139, 92, 246, 0.06),
      transparent 40%
    );
    z-index: 3;
  }
  .card::after {
    background: radial-gradient(
      500px circle at var(--mouse-x) var(--mouse-y),
      rgba(139, 92, 246, 0.28),
      transparent 40%
    );
    z-index: 1;
  }
  .card > .card-content {
    background-color: ${({ theme }) => theme.bgcards};
    border-radius: inherit;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    inset: 1px;
    padding: 14px;
    position: absolute;
    z-index: 2;
  }
  h1,
  h2,
  h3,
  h4,
  span {
    color: ${({ theme }) => theme.text};
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    margin: 0;
  }
  .card-image {
    align-items: center;
    display: flex;
    height: 130px;
    justify-content: center;
    img {
      transition: 0.25s ease-out;
      height: 68%;
      filter: grayscale(100%);
    }
  }
  .card-info-wrapper {
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: flex-start;
    padding: 0 16px;
  }
  .card-info {
    align-items: flex-start;
    display: flex;
    gap: 10px;
  }
  .card-info-title > h3 {
    font-size: 1.05em;
    line-height: 20px;
    color: ${({ theme }) => theme.colortitlecard};
  }
  .card-info-title > h4 {
    color: ${({ theme }) => theme.colorSubtitle};
    font-size: 0.82em;
    margin-top: 6px;
    font-weight: 400;
  }
  @media (max-width: 1000px) {
    #cards {
      max-width: 650px;
    }
  }
  @media (max-width: 700px) {
    align-items: flex-start;
    overflow: auto;
    #cards {
      max-width: 400px;
    }
    .card {
      flex-shrink: 1;
      width: calc(50% - 8px);
    }
  }
  @media (max-width: 500px) {
    .card {
      height: 180px;
      width: 100%;
    }
    .card-image {
      height: 80px;
    }
    .card-info-wrapper {
      padding: 0 10px;
    }
    .card-info-title > h3 {
      font-size: 0.9em;
    }
    .card-info-title > h4 {
      font-size: 0.8em;
      margin-top: 4px;
    }
  }
`;
