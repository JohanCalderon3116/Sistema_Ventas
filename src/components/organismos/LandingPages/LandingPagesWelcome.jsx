import React, { useEffect } from "react";
import styled from "styled-components";
import { CardFuncion } from "./CardFuncion";
import { Device } from "../../../styles/breakpoints"; 
import ScrollReveal from "scrollreveal";

export const LandingPagesWelcome = () => {
  useEffect(() => {
    ScrollReveal().reveal(".left-section", {
      origin: "left",
      distance: "80px",
      duration: 1200,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
    });

    ScrollReveal().reveal(".right-section", {
      origin: "right",
      distance: "80px",
      duration: 1200,
      easing: "cubic-bezier(0.5, 0, 0, 1)",
    });
  }, []);

  return (
    <Container>
      <ContentSection>
        <SubContentSection>
          <LeftSection className="left-section">
            <BadgeCorporate>Soluciones de Software</BadgeCorporate>
            <MainTitle>SoftCreate <span>POS</span></MainTitle>
            
            <AuthorText>
              Arquitectura y desarrollo por <strong>Ing. Johan Camilo Calderón Álvarez</strong>
            </AuthorText>

            <FeaturesList>
              <Step>
                <IconPlaceholder>
                  <img src="https://i.ibb.co/HCF7jnx/escaparate.png" alt="Gestión" />
                </IconPlaceholder>
                <Text>
                  <Title>Gestión Empresarial Integral</Title>
                  <Description>
                    Controla sucursales, inventarios y ventas en tiempo real con un sistema robusto y escalable.
                  </Description>
                </Text>
              </Step>
              <Step>
                <IconPlaceholder>
                  <img src="https://i.ibb.co/MV6xZz4/franquicia.png" alt="Escalabilidad" />
                </IconPlaceholder>
                <Text>
                  <Title>Optimización de Procesos</Title>
                  <Description>
                    Automatiza tareas operativas y centraliza la información de múltiples puntos de venta.
                  </Description>
                </Text>
              </Step>
              <Step>
                <IconPlaceholder>
                  <img src="https://i.ibb.co/3dZfQzF/caja-registradora.png" alt="Seguridad" />
                </IconPlaceholder>
                <Text>
                  <Title>Alta Disponibilidad y Seguridad</Title>
                  <Description>
                    Arquitectura moderna diseñada para mantener tus datos protegidos y siempre accesibles.
                  </Description>
                </Text>
              </Step>
            </FeaturesList>
            
            {/* Se reemplazaron los links por etiquetas informativas estáticas */}
            <InfoTagsGroup>
              <InfoTagPrimary>✓ Sistema Multi-entorno</InfoTagPrimary>
              <InfoTagSecondary>Arquitectura Escalable</InfoTagSecondary>
            </InfoTagsGroup>

          </LeftSection>

          <RightSection className="right-section">
            <MockupBackground>
              <MockupImage>
                {/* Los colores de bgcontentimagen siguen estáticos para mantener la identidad del ícono, 
                    pero la tarjeta en sí ya responde al tema oscuro/claro */}
                <CardFuncion
                  top="10px"
                  bgcontentimagen={"#E0E7FF"} 
                  left={"-50px"}
                  title={"Multi-empresa"}
                  imagen={"https://i.ibb.co/HCF7jnx/escaparate.png"}
                />
                <CardFuncion
                  top="110px"
                  bgcontentimagen={"#F3E8FF"} // Tono sutil morado
                  left={"-20px"}
                  title={"Multi-sucursal"}
                  imagen={"https://i.ibb.co/MV6xZz4/franquicia.png"}
                />
                <CardFuncion
                  top="210px"
                  bgcontentimagen={"#CFFAFE"}
                  left={"-50px"}
                  title={"Multi-caja"}
                  imagen={"https://i.ibb.co/3dZfQzF/caja-registradora.png"}
                />
                <CardFuncion
                  top="310px"
                  bgcontentimagen={"#FFEDD5"}
                  left={"-20px"}
                  title={"Multi-almacen"}
                  imagen={"https://qkzybkelsdmoezaaypou.supabase.co/storage/v1/object/public/imagenes/modulos/almacen.png"}
                />
                <CardFuncion
                  top="410px"
                  bgcontentimagen={"#EAEBFF"}
                  left={"-50px"}
                  title={"Impresión Directa"}
                  subtitle={"Sin latencia"}
                  imagen={"https://qkzybkelsdmoezaaypou.supabase.co/storage/v1/object/public/imagenes/modulos/impresora.png"}
                />
              </MockupImage>
            </MockupBackground>
          </RightSection>
        </SubContentSection>
      </ContentSection>
    </Container>
  );
};

// --- ESTILOS ADAPTADOS AL THEME ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: ${({ theme }) => theme.bgtotal};
  /* Toque morado muy sutil en el fondo mezclado con el primary */
  background-image: 
    radial-gradient(circle at 80% 20%, ${({ theme }) => theme.carouselColor}15, transparent 40%),
    radial-gradient(circle at 20% 80%, ${({ theme }) => theme.primary}10, transparent 40%);
  transition: all 0.3s ease;
`;

const ContentSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const SubContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 40px;

  @media ${Device.desktop} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 550px;

  @media ${Device.desktop} {
    align-items: flex-start;
  }
`;

const BadgeCorporate = styled.span`
  background-color: ${({ theme }) => theme.bg6}; /* Usando tu bg6 con transparencia */
  color: ${({ theme }) => theme.carouselColor}; /* Tu color morado de la paleta */
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  align-self: flex-start;
  border: 1px solid ${({ theme }) => theme.carouselColor}30;
`;

const MainTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin: 0;
  line-height: 1.1;

  span {
    background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.carouselColor});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media ${Device.desktop} {
    font-size: 52px;
  }
`;

const AuthorText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 0 0 10px 0;
  padding-left: 12px;
  border-left: 3px solid ${({ theme }) => theme.carouselColor};

  strong {
    color: ${({ theme }) => theme.text};
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 10px;
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const IconPlaceholder = styled.div`
  min-width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.bgcards};
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 6px -1px ${({ theme }) => theme.bgAlpha};
  border: 1px solid ${({ theme }) => theme.bg2};
  
  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colortitlecard};
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colorSubtitle};
  margin: 0;
  line-height: 1.5;
`;

const InfoTagsGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const InfoTagPrimary = styled.div`
  background-color: ${({ theme }) => theme.carouselColor}15; /* 15 es opacidad en HEX */
  color: ${({ theme }) => theme.carouselColor};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.carouselColor}40;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoTagSecondary = styled.div`
  background-color: transparent;
  color: ${({ theme }) => theme.colorSubtitle};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: 1px dashed ${({ theme }) => theme.colorScroll};
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 40px;

  @media ${Device.desktop} {
    margin-top: 0;
  }
`;

const MockupBackground = styled.div`
  position: relative;
  &::before {
    content: "";
    height: 380px;
    width: 380px;
    background: radial-gradient(circle, ${({ theme }) => theme.carouselColor}30 0%, transparent 70%);
    position: absolute;
    z-index: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    animation: pulseGlow 4s ease-in-out infinite;
  }

  @keyframes pulseGlow {
      0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.5; }
  }
`;

const MockupImage = styled.div`
  width: 260px;
  height: 520px;
  background-color: ${({ theme }) => theme.bg3}; 
  border-radius: 30px;
  border: 8px solid ${({ theme }) => theme.bgtgderecha};
  position: relative;
  z-index: 1;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
`;