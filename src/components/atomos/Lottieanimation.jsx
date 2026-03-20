import Lottie from "react-lottie";

export const Lottieanimation = ({ alto, ancho, animacion }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animacion,
  };
  return (
    <>
      <Lottie
        options={defaultOptions}
        height={`${alto}px`}
        width={`${ancho}px`}
        isClickToPauseDisabled
      ></Lottie>
    </>
  );
};
