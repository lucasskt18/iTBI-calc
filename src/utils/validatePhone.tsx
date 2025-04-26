const validarTelefone = (phoneRegister: string, phoneITBI: string) => {
  if (phoneRegister === phoneITBI) {
    return 'Os telefones são iguais. Validação bem-sucedida!';
  } else {
    return 'Os telefones são diferentes. Tente novamente.';
  }
};

export default validarTelefone;
