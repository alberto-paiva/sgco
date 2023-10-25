type CodigosEstados = Record<string, string>;

const CODIGOS_ESTADOS: CodigosEstados = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export const getNomeUF = async (uf: string): Promise<string | undefined> => {
  const formattedUF = uf.toUpperCase();
  return CODIGOS_ESTADOS[formattedUF];
};

export const getUFKeys = (): string[] => {
  // Extract only the keys from CODIGOS_ESTADOS
  return Object.keys(CODIGOS_ESTADOS);
};
