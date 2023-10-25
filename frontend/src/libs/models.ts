/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

interface CondominioData {
  id?: number;
  uuid: string;
  nome: string;
  email?: string;
  cnpj?: string;
  contato?: string;
  dataAbertura?: string;
  dataEncerramento?: string;
  imagemPerfil?: string;
  observacao?: string;
  idEndereco?: number;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  pais?: string;
}

interface CondominioDistinctData {
  id?: number;
  nome?: string;
}

interface CondominoData {
  id?: number;
  uuid: string;
  nome: string;
  email?: string;
  cpf?: string;
  contato: string;
  proprietario: boolean;
  dataEntrada: string;
  dataSaida?: string;
  observacao?: string;
  tipo?: "C";
  imagemPerfil?: string;
  idUnidade?: number;
  bloco?: string;
  numero?: string;
  observacaoUnidade?: string;
  idCondominio?: number;
}

interface SindicoData {
  id?: number;
  uuid: string;
  nome: string;
  email?: string;
  cpf?: string;
  contato: string;
  dataEntrada: string;
  dataSaida?: string;
  imagemPerfil?: string;
  observacao?: string;
  tipo?: "S";
  ativo: boolean;
  idCondominio?: number;
  idEndereco?: number;
  nomeCondominio?: string;
  endereco?: string;
}

interface FileModel {
  path: "images" | "archives";
  file: File;
  foderName: string;
}

interface UnidadeData {
  id?: number;
  bloco: string;
  numero: string;
  observacao?: string;
  idCondominio?: number;
  nomeCondominio?: string;
}

interface ApartamentoData {
  value: number;
  label: string;
}

interface BlocoLabelsData {
  label: string;
}

interface EnderecoData {
  id?: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf?: string;
  cep?: string;
  pais?: string;
}

interface EnderecoFormatadoData {
  id?: number;
  endereco: string;
}

interface EnderecoViaCEPData {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ibge?: string;
  error?: string;
  // VIACEP IS DOWN MANY TIMES :(
  // gia?: string;
  // ddd?: string;
  // siafi?: string;
}

/**
 * tipos: (Condomino: C) | (Profissional: P) | (Sindico: S) | (Administrador: A)
 */
interface UsuarioData {
  id?: number;
  nomeusuario: string;
  senha: string;
  tipo: "C" | "P" | "S" | "A";
  ativo: boolean;
  idPessoa: number;
  //
  lastIP?: string;
  lastLogin?: string;
  //
  idTable2?: number;
  uuid: string;
  nome: string;
  email?: string;
  cpf?: string;
  contato: string;
  dataEntrada: string;
  dataSaida?: string;
  imagemPerfil?: string;
  observacao?: string;
  proprietario?: boolean;
  pessoaAtiva: boolean;
  idUnidade?: number;
  bloco?: string;
  numero?: string;
  observacaoUnidade?: string;
  idCondominio?: number;
  nomeCondominio?: string;
}

interface FinanceiroData {
  id?: number;
  uuid: string;
  titulo: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  anoCalendario?: string;
  statusFinanceiro?: "PENDENTE" | "PAGO" | "ANALISE";
  tipo?: "RECEITA" | "DESPESA";
  observacao?: string;
  comprovante?: string;
  comprovanteFile?: File;
  idUnidade?: number;
}

interface PerPage {
  start: number;
  end: number;
}

interface FetchDataProps<T> {
  data?: T | null;
  dataArray?: T[];
  loading: boolean;
  error: string | null;
}
