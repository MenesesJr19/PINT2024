import { useState } from 'react';
import { Validador } from 'utils/validator';

export function useValidationErrors(schema) {
  const [erros, setErros] = useState({});

  const validar = (dados) => {
    const validador = new Validador(schema);
    const validacao = validador.validar(dados);
    setErros(validacao);
    return validador.isValido(validacao);
  };

  return { erros, validar };
}
