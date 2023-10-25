import { formatCEP } from "libs/utils.ts";

interface EnderecoProps {
  id?: number;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  pais?: string;
  inline?: boolean;
}
export const EnderecoField = (endereco: EnderecoProps) => {
  const _inline = <br />;

  return (
    <div>
      {endereco.rua}, {endereco.numero}.{endereco.inline ? " " : _inline}
      {endereco?.complemento ? endereco?.complemento + ". " : ""}
      {endereco.bairro}
      {endereco.inline ? ". " : _inline}
      {endereco.cidade}, {endereco?.uf?.toUpperCase()}.{" "}
      {endereco.cep ? `CEP: ${formatCEP(endereco.cep)}` : ""}
      {endereco.inline ? ". " : _inline}
      {endereco?.pais}.
    </div>
  );
};
