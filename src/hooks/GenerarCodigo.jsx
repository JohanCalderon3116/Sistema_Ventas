export const GenerarCodigo = (data) => {
  const ultimoIdProducto = data.id + 1;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const codeLength = 4;
  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    randomCode += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  const codigo = `${randomCode}${ultimoIdProducto}574`;
  return codigo;
};
