import { baseUrl } from "libs/api/base-api.ts";
import { getUserIP } from "libs/api/ip-address.ts";
import jscrudapi from "js-crud-api";

export const API_URL = `${baseUrl}/api.php`;

const jca = jscrudapi<UsuarioData>(API_URL);

// const config={ headers : { 'X-API-Key':'afancyapikey' }}
// const jca=jscrudapi(api_url, config);const config={ headers : { 'X-API-Key':'afancyapikey' }}
// const jca=jscrudapi(api_url, config);

export enum UsuarioField {
  Id,
  NomeUsuario,
  Senha,
  Tipo,
  Ativo,
  IdPessoa,
  //
  LastIP,
  LastLogin,
  //
  IdTable2,
  Uuid,
  Nome,
  Email,
  CPF,
  Contato,
  DataEntrada,
  DataSaida,
  ImagemPerfil,
  Observacao,
  Proprietario,
  PessoaAtiva,
  //
  IdUnidade,
  Bloco,
  Numero,
  ObservacaoUnidade,
  //
  IdCondominio,
  NomeCondominio,
}

class AuthService {
  public readonly USER_KEY = "yuploggeduser";
  private userip: unknown;

  async login(username: string, password: string) {
    try {
      const result = await jca.login(username, password);
      let fullUser = null;
      this.userip = await getUserIP();

      const userActivated = result?.ativo;

      if (result && userActivated && !(await this.isValidLoginTime())) {
        await jca.update("usuario", result.id, {
          lastLogin: Date.now().toString(),
          lastIP: this.userip,
        });
      }

      if (result) {
        fullUser = await jca.read(
          result.tipo === "C"
            ? "usuarioscondominos"
            : result.tipo === "S"
            ? "usuariossindicos"
            : "",
          result.id,
        );
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(fullUser));

      return result?.id && userActivated && fullUser;
    } catch (error) {
      console.log(JSON.stringify(error));
      return false;
    }
  }

  async logout() {
    try {
      return jca.logout();
    } catch (error) {
      console.log(JSON.stringify(error));
      return error;
    } finally {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  async register(username: string, password: string) {
    try {
      return jca.register(username, password);
    } catch (error) {
      console.log(JSON.stringify(error));
      return error;
    }
  }

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (userStr) return JSON.parse(userStr);
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }

  getCurrentUserField(userField: UsuarioField) {
    try {
      const userLogged: UsuarioData | null = this.getCurrentUser();
      switch (userField) {
        case UsuarioField.Id:
          return userLogged?.id;
        case UsuarioField.NomeUsuario:
          return userLogged?.nomeusuario;
        case UsuarioField.Senha:
          return "";
        case UsuarioField.Tipo:
          return userLogged?.tipo;
        case UsuarioField.IdPessoa:
          return userLogged?.idPessoa;
        case UsuarioField.LastIP:
          return userLogged?.lastIP;
        case UsuarioField.LastLogin:
          return userLogged?.lastLogin;
        case UsuarioField.IdTable2:
          return userLogged?.idTable2;
        case UsuarioField.Uuid:
          return userLogged?.uuid;
        case UsuarioField.Nome:
          return userLogged?.nome;
        case UsuarioField.Email:
          return userLogged?.email;
        case UsuarioField.CPF:
          return userLogged?.cpf;
        case UsuarioField.Contato:
          return userLogged?.contato;
        case UsuarioField.DataEntrada:
          return userLogged?.dataEntrada;
        case UsuarioField.DataSaida:
          return userLogged?.dataSaida;
        case UsuarioField.ImagemPerfil:
          return userLogged?.imagemPerfil;
        case UsuarioField.Observacao:
          return userLogged?.observacao;
        case UsuarioField.Proprietario:
          return userLogged?.proprietario;
        case UsuarioField.PessoaAtiva:
          return userLogged?.pessoaAtiva;
        case UsuarioField.IdUnidade:
          return userLogged?.idUnidade;
        case UsuarioField.Bloco:
          return userLogged?.bloco;
        case UsuarioField.Numero:
          return userLogged?.numero;
        case UsuarioField.ObservacaoUnidade:
          return userLogged?.observacaoUnidade;
        case UsuarioField.IdCondominio:
          return userLogged?.idCondominio;
        case UsuarioField.NomeCondominio:
          return userLogged?.nomeCondominio;
        case UsuarioField.Ativo:
          return userLogged?.ativo;
        default:
          return null;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }

  getCurrentUserRole() {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      let userRole: UsuarioData | null = null;
      if (userStr) userRole = JSON.parse(userStr);
      return userRole?.tipo;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }

  userIsCondomino() {
    try {
      return this.getCurrentUserRole() === "C";
    } catch (error) {
      console.log(JSON.stringify(error));
      return false;
    }
  }

  async getCurrentFullUser() {
    try {
      const result = await jca.read("usuario", this.getCurrentUser().id);

      const isUserActivated = result?.ativo;

      if (result && isUserActivated && !(await this.isValidLoginTime())) {
        return result;
      }
      return null;
    } catch (error) {
      console.log(JSON.stringify(error));
      return error;
    }
  }

  async isValidLoginTime() {
    let valid = false;
    try {
      const loggedUser = this.getCurrentUser();
      if (loggedUser) {
        const timestampFromServer = new Date(+loggedUser.lastLogin).setUTCHours(
          0,
          0,
          0,
          0,
        );
        const actualTimestamp = new Date(Date.now()).setUTCHours(0, 0, 0, 0);

        valid =
          timestampFromServer === actualTimestamp &&
          loggedUser.lastIP === (await getUserIP());
      }

      return valid;
    } catch (error) {
      console.log(JSON.stringify(error));
      return valid;
    }
  }
}

export default new AuthService();
