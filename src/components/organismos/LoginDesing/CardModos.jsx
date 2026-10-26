import styled from "styled-components";
import { Icon } from "@iconify/react";

export function CardModos({ title, subtitle, img, bgcolor, funcion }) {
  const isIconName = typeof img === "string" && !img.startsWith("http") && !img.startsWith("/");

  return (
    <Container $bgcolor={bgcolor} onClick={funcion}>
      <section className="card-container">
        <article className="content-wrapper">
          <section className="badge-container">
            <span className="badge-button">{title}</span>
          </section>
          <section className="title-section">
            <span className="subtitle">{subtitle}</span>
          </section>
        </article>
        <article className="image-container">
          {isIconName ? (
            <div className="icon-box">
              <Icon icon={img} className="role-icon" />
            </div>
          ) : (
            <img
              className="character-image"
              src={img}
              alt={title}
            />
          )}
        </article>
      </section>
    </Container>
  );
}

const isDarkTheme = (theme) =>
  theme?.text === "#FFFFFF" ||
  theme?.bgtotal === "#050505" ||
  theme?.bgtotal === "#000000" ||
  theme?.bgtotal === "#121216" ||
  theme?.bgtotal === "#09090B" ||
  theme?.bgtotal === "#101010";

const Container = styled.section`
  width: 100%;

  .card-container {
    cursor: pointer;
    position: relative;
    background: ${({ theme }) => (isDarkTheme(theme) ? "#0D0D0D" : "#F7F7F8")};
    border: 1px solid
      ${({ theme }) =>
        isDarkTheme(theme)
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(17, 17, 17, 0.1)"};
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: ${({ theme }) =>
      isDarkTheme(theme)
        ? "0 1px 2px rgba(0, 0, 0, 0.5)"
        : "0 1px 2px rgba(17, 17, 17, 0.04)"};
    transition: all 0.2s ease-out;

    &:hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) =>
        isDarkTheme(theme)
          ? "rgba(255, 255, 255, 0.24)"
          : "rgba(17, 17, 17, 0.24)"};
      background: ${({ theme }) => (isDarkTheme(theme) ? "#141414" : "#EFEFF2")};
      box-shadow: ${({ theme }) =>
        isDarkTheme(theme)
          ? "0 10px 24px -8px rgba(0, 0, 0, 0.7)"
          : "0 10px 24px -8px rgba(17, 17, 17, 0.08)"};

      .icon-box {
        background: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
        border-color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#111111")};
        color: ${({ theme }) => (isDarkTheme(theme) ? "#050505" : "#FFFFFF")};
      }
    }
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 4px;
    text-align: left;
  }

  .badge-container {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .badge-button {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#121216")};
  }

  .title-section {
    display: flex;
    flex-direction: column;
  }

  .subtitle {
    font-size: 0.82rem;
    color: ${({ theme }) => (isDarkTheme(theme) ? "#A1A1AA" : "#52525B")};
    font-weight: 400;
    line-height: 1.35;
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .icon-box {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) =>
      isDarkTheme(theme)
        ? "rgba(255, 255, 255, 0.06)"
        : "rgba(18, 18, 22, 0.05)"};
    border: 1px solid
      ${({ theme }) =>
        isDarkTheme(theme)
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(18, 18, 22, 0.1)"};
    color: ${({ theme }) => (isDarkTheme(theme) ? "#FFFFFF" : "#121216")};
    transition: all 0.2s ease-out;
  }

  .role-icon {
    font-size: 20px;
  }

  .character-image {
    height: 40px;
    width: 40px;
    object-fit: contain;
  }
`;
