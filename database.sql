-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 24/10/2023 às 22:34
-- Versão do servidor: 8.0.31
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sgcodb`
--

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `apartamentos`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `apartamentos`;
CREATE TABLE IF NOT EXISTS `apartamentos` (
`value` int
,`label` varchar(10)
,`bloco` varchar(10)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `apartamentosformatados`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `apartamentosformatados`;
CREATE TABLE IF NOT EXISTS `apartamentosformatados` (
`value` int
,`label` varchar(130)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `aviso`
--

DROP TABLE IF EXISTS `aviso`;
CREATE TABLE IF NOT EXISTS `aviso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_general_ci NOT NULL,
  `dataPublicacao` datetime NOT NULL,
  `status` enum('ATIVO','CONCLUIDO','EXPIRADO') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'ATIVO',
  `idAutor` int DEFAULT NULL,
  `idSsindico` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Aviso_FK` (`idSsindico`),
  KEY `Aviso_FK_1` (`idAutor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `condominio`
--

DROP TABLE IF EXISTS `condominio`;
CREATE TABLE IF NOT EXISTS `condominio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cnpj` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contato` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dataAbertura` datetime DEFAULT NULL,
  `dataEncerramento` datetime DEFAULT NULL,
  `imagemPerfil` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `observacao` text COLLATE utf8mb4_general_ci,
  `idEndereco` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Condominio_FK` (`idEndereco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `condominiocompleto`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `condominiocompleto`;
CREATE TABLE IF NOT EXISTS `condominiocompleto` (
`id` int
,`uuid` char(36)
,`nome` varchar(100)
,`email` varchar(100)
,`cnpj` varchar(14)
,`contato` varchar(20)
,`dataAbertura` datetime
,`dataEncerramento` datetime
,`imagemPerfil` text
,`observacao` text
,`idEndereco` int
,`rua` varchar(150)
,`numero` varchar(10)
,`complemento` text
,`bairro` varchar(150)
,`cidade` varchar(150)
,`uf` varchar(2)
,`cep` varchar(8)
,`pais` varchar(255)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `condominiosdistinct`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `condominiosdistinct`;
CREATE TABLE IF NOT EXISTS `condominiosdistinct` (
`id` int
,`nome` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `condomino`
--

DROP TABLE IF EXISTS `condomino`;
CREATE TABLE IF NOT EXISTS `condomino` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) COLLATE utf8mb4_general_ci NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cpf` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contato` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `proprietario` tinyint(1) NOT NULL COMMENT 'Informa se é proprietário',
  `dataEntrada` datetime NOT NULL,
  `dataSaida` datetime DEFAULT NULL,
  `imagemPerfil` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `observacao` text COLLATE utf8mb4_general_ci,
  `tipo` enum('C') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'C',
  `ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Informa se a conta está ativa!',
  `idUnidade` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_unique` (`uuid`),
  KEY `Condomino_FK` (`idUnidade`),
  KEY `Condomino_FK_1` (`imagemPerfil`(768))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `condominocompleto`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `condominocompleto`;
CREATE TABLE IF NOT EXISTS `condominocompleto` (
`id` int
,`uuid` char(36)
,`nome` varchar(100)
,`email` varchar(100)
,`cpf` varchar(11)
,`contato` varchar(20)
,`dataEntrada` datetime
,`dataSaida` datetime
,`imagemPerfil` text
,`observacao` text
,`proprietario` tinyint(1)
,`tipo` enum('C')
,`ativo` tinyint(1)
,`idUnidade` int
,`bloco` varchar(10)
,`numero` varchar(10)
,`observacaoUnidade` text
,`idCondominio` int
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `condominoimage`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `condominoimage`;
CREATE TABLE IF NOT EXISTS `condominoimage` (
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `endereco`
--

DROP TABLE IF EXISTS `endereco`;
CREATE TABLE IF NOT EXISTS `endereco` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rua` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `numero` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `complemento` text COLLATE utf8mb4_general_ci,
  `bairro` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `cidade` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `uf` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cep` varchar(8) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pais` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `enderecoformatado`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `enderecoformatado`;
CREATE TABLE IF NOT EXISTS `enderecoformatado` (
`id` int
,`endereco` mediumtext
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `financeiro`
--

DROP TABLE IF EXISTS `financeiro`;
CREATE TABLE IF NOT EXISTS `financeiro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `valor` decimal(18,2) NOT NULL,
  `statusFinanceiro` enum('PENDENTE','PAGO','ANALISE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDENTE',
  `dataVencimento` datetime NOT NULL,
  `dataPagamento` datetime DEFAULT NULL,
  `anoCalendario` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('RECEITA','DESPESA') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DESPESA',
  `observacao` text COLLATE utf8mb4_general_ci,
  `comprovante` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `idUnidade` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Pagamento_FK` (`idUnidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomeusuario` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('C','P','S','A') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Condomino: C | Profissional: P | Sindico: S | Administrador: A',
  `ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Informa se a conta está ativa no sistema',
  `lastIP` varchar(46) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastLogin` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `idPessoa` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabela para gravação de dados de acesso dos usuários do sistema.';

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `mensalidade`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `mensalidade`;
CREATE TABLE IF NOT EXISTS `mensalidade` (
`id` int
,`uuid` char(36)
,`titulo` varchar(100)
,`valor` decimal(18,2)
,`dataVencimento` datetime
,`dataPagamento` datetime
,`anoCalendario` varchar(4)
,`statusFinanceiro` enum('PENDENTE','PAGO','ANALISE')
,`tipo` enum('RECEITA','DESPESA')
,`observacao` text
,`comprovante` longtext
,`idUnidade` int
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ocorrencia`
--

DROP TABLE IF EXISTS `ocorrencia`;
CREATE TABLE IF NOT EXISTS `ocorrencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idUnidade` int NOT NULL,
  `descricao` text COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('PENDENTE','CONCLUIDA') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'PENDENTE',
  `dataCriacao` datetime NOT NULL,
  `dataConclusao` datetime DEFAULT NULL,
  `idSindico` int DEFAULT NULL,
  `idMorador` int DEFAULT NULL,
  `idProfissional` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Ocorrencia_FK` (`idUnidade`),
  KEY `Ocorrencia_FK_1` (`idSindico`),
  KEY `Ocorrencia_FK_2` (`idMorador`),
  KEY `Ocorrencia_FK_3` (`idProfissional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `profissional`
--

DROP TABLE IF EXISTS `profissional`;
CREATE TABLE IF NOT EXISTS `profissional` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `documento` varchar(14) COLLATE utf8mb4_general_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `especialidade` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `imagemPerfil` longtext COLLATE utf8mb4_general_ci,
  `observacao` text COLLATE utf8mb4_general_ci,
  `dataCadastro` datetime NOT NULL,
  `dataAtualizacao` datetime DEFAULT NULL,
  `tipo` enum('P') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'P',
  `ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Informa se a conta está ativa',
  `idEndereco` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Profissional_FK` (`idEndereco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sindico`
--

DROP TABLE IF EXISTS `sindico`;
CREATE TABLE IF NOT EXISTS `sindico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cpf` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contato` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `dataEntrada` datetime NOT NULL,
  `dataSaida` datetime DEFAULT NULL,
  `imagemPerfil` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `observacao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tipo` enum('S') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'S',
  `ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Informa se a conta está ativa!',
  `idCondominio` int NOT NULL,
  `idEndereco` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Sindico_FK` (`idCondominio`),
  KEY `Sindico_FK_1` (`idEndereco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `sindicoscompleto`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `sindicoscompleto`;
CREATE TABLE IF NOT EXISTS `sindicoscompleto` (
`id` int
,`uuid` char(36)
,`nome` varchar(100)
,`email` varchar(100)
,`cpf` varchar(11)
,`contato` varchar(20)
,`dataEntrada` datetime
,`dataSaida` datetime
,`imagemPerfil` longtext
,`observacao` text
,`tipo` enum('S')
,`ativo` tinyint(1)
,`idCondominio` int
,`idEndereco` int
,`nomeCondominio` varchar(100)
,`endereco` mediumtext
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `unidade`
--

DROP TABLE IF EXISTS `unidade`;
CREATE TABLE IF NOT EXISTS `unidade` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bloco` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `numero` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `observacao` text COLLATE utf8mb4_general_ci,
  `idCondominio` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Unidade_FK` (`idCondominio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `unidadeblocosdistinct`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `unidadeblocosdistinct`;
CREATE TABLE IF NOT EXISTS `unidadeblocosdistinct` (
`label` varchar(10)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `unidadescompletas`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `unidadescompletas`;
CREATE TABLE IF NOT EXISTS `unidadescompletas` (
`id` int
,`bloco` varchar(10)
,`numero` varchar(10)
,`observacao` text
,`idCondominio` int
,`nomeCondominio` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomeusuario` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('C','P','S','A') COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Condomino: C | Profissional: P | Sindico: S | Administrador: A',
  `ativo` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Informa se a conta está ativa no sistema',
  `lastIP` varchar(46) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastLogin` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `idPessoa` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabela para criação de usuários do sistema.\r\nApenas adnistradores podem criar novos usuários, uma vez que somente devem ser cadastrados moradores ativos do condomínio.';

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `usuarioscondominos`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `usuarioscondominos`;
CREATE TABLE IF NOT EXISTS `usuarioscondominos` (
`id` int
,`nomeusuario` varchar(100)
,`tipo` enum('C','P','S','A')
,`ativo` tinyint(1)
,`lastIP` varchar(46)
,`lastLogin` varchar(20)
,`idPessoa` int
,`uuid` char(36)
,`nome` varchar(100)
,`email` varchar(100)
,`cpf` varchar(11)
,`contato` varchar(20)
,`dataEntrada` datetime
,`dataSaida` datetime
,`imagemPerfil` text
,`observacao` text
,`proprietario` tinyint(1)
,`tipoPessoa` enum('C')
,`pessoaAtiva` tinyint(1)
,`idUnidade` int
,`bloco` varchar(10)
,`numero` varchar(10)
,`observacaoUnidade` text
,`idCondominio` int
,`nomeCondominio` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `usuariossindicos`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `usuariossindicos`;
CREATE TABLE IF NOT EXISTS `usuariossindicos` (
`id` int
,`nomeusuario` varchar(100)
,`tipo` enum('C','P','S','A')
,`ativo` tinyint(1)
,`lastIP` varchar(46)
,`lastLogin` varchar(20)
,`idPessoa` int
,`uuid` char(36)
,`nome` varchar(100)
,`email` varchar(100)
,`cpf` varchar(11)
,`contato` varchar(20)
,`dataEntrada` datetime
,`dataSaida` datetime
,`imagemPerfil` longtext
,`observacao` text
,`pessoaAtiva` tinyint(1)
,`tipoPessoa` enum('S')
,`nomeCondominio` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura para view `apartamentos`
--
DROP TABLE IF EXISTS `apartamentos`;

DROP VIEW IF EXISTS `apartamentos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `apartamentos`  AS SELECT DISTINCT `u`.`id` AS `value`, `u`.`numero` AS `label`, `u`.`bloco` AS `bloco` FROM `unidade` AS `u` ;

-- --------------------------------------------------------

--
-- Estrutura para view `apartamentosformatados`
--
DROP TABLE IF EXISTS `apartamentosformatados`;

DROP VIEW IF EXISTS `apartamentosformatados`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `apartamentosformatados`  AS SELECT DISTINCT `u`.`id` AS `value`, concat('AP.',`u`.`numero`,', BL.',`u`.`bloco`,'. ',`c`.`nome`) AS `label` FROM (`unidade` `u` join `condominio` `c` on((`c`.`id` = `u`.`idCondominio`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `condominiocompleto`
--
DROP TABLE IF EXISTS `condominiocompleto`;

DROP VIEW IF EXISTS `condominiocompleto`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `condominiocompleto`  AS SELECT `c`.`id` AS `id`, `c`.`uuid` AS `uuid`, `c`.`nome` AS `nome`, `c`.`email` AS `email`, `c`.`cnpj` AS `cnpj`, `c`.`contato` AS `contato`, `c`.`dataAbertura` AS `dataAbertura`, `c`.`dataEncerramento` AS `dataEncerramento`, `c`.`imagemPerfil` AS `imagemPerfil`, `c`.`observacao` AS `observacao`, `c`.`idEndereco` AS `idEndereco`, `e`.`rua` AS `rua`, `e`.`numero` AS `numero`, `e`.`complemento` AS `complemento`, `e`.`bairro` AS `bairro`, `e`.`cidade` AS `cidade`, `e`.`uf` AS `uf`, `e`.`cep` AS `cep`, `e`.`pais` AS `pais` FROM (`condominio` `c` left join (select `e`.`id` AS `id`,`e`.`rua` AS `rua`,`e`.`numero` AS `numero`,`e`.`complemento` AS `complemento`,`e`.`bairro` AS `bairro`,`e`.`cidade` AS `cidade`,`e`.`uf` AS `uf`,`e`.`cep` AS `cep`,`e`.`pais` AS `pais` from `endereco` `e`) `e` on((`c`.`idEndereco` = `e`.`id`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `condominiosdistinct`
--
DROP TABLE IF EXISTS `condominiosdistinct`;

DROP VIEW IF EXISTS `condominiosdistinct`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `condominiosdistinct`  AS SELECT DISTINCT `c`.`id` AS `id`, `c`.`nome` AS `nome` FROM `condominio` AS `c` ;

-- --------------------------------------------------------

--
-- Estrutura para view `condominocompleto`
--
DROP TABLE IF EXISTS `condominocompleto`;

DROP VIEW IF EXISTS `condominocompleto`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `condominocompleto`  AS SELECT `c`.`id` AS `id`, `c`.`uuid` AS `uuid`, `c`.`nome` AS `nome`, `c`.`email` AS `email`, `c`.`cpf` AS `cpf`, `c`.`contato` AS `contato`, `c`.`dataEntrada` AS `dataEntrada`, `c`.`dataSaida` AS `dataSaida`, `c`.`imagemPerfil` AS `imagemPerfil`, `c`.`observacao` AS `observacao`, `c`.`proprietario` AS `proprietario`, `c`.`tipo` AS `tipo`, `c`.`ativo` AS `ativo`, `c`.`idUnidade` AS `idUnidade`, `u`.`bloco` AS `bloco`, `u`.`numero` AS `numero`, `u`.`observacao` AS `observacaoUnidade`, `u`.`idCondominio` AS `idCondominio` FROM (`condomino` `c` left join (select `u`.`id` AS `id`,`u`.`bloco` AS `bloco`,`u`.`numero` AS `numero`,`u`.`observacao` AS `observacao`,`u`.`idCondominio` AS `idCondominio` from `unidade` `u`) `u` on((`c`.`idUnidade` = `u`.`id`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `condominoimage`
--
DROP TABLE IF EXISTS `condominoimage`;

DROP VIEW IF EXISTS `condominoimage`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `condominoimage`  AS SELECT `c`.`id` AS `idCondomino`, `i`.`imagem` AS `imagem`, `i`.`id` AS `idCondominoImage` FROM (`condomino` `c` left join (select `i`.`id` AS `id`,`i`.`imagem` AS `imagem`,`i`.`idCondomino` AS `idCondomino` from `imagemcondomino` `i`) `i` on((`c`.`id` = `i`.`idCondomino`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `enderecoformatado`
--
DROP TABLE IF EXISTS `enderecoformatado`;

DROP VIEW IF EXISTS `enderecoformatado`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `enderecoformatado`  AS SELECT `e`.`id` AS `id`, concat(`e`.`rua`,', ',`e`.`numero`,if((`e`.`complemento` is not null),concat('. (',`e`.`complemento`,'). '),'. '),`e`.`bairro`,'. ',`e`.`cidade`,', ',`e`.`uf`,'. ',`e`.`pais`,'. CEP: ',`e`.`cep`) AS `endereco` FROM `endereco` AS `e` ;

-- --------------------------------------------------------

--
-- Estrutura para view `mensalidade`
--
DROP TABLE IF EXISTS `mensalidade`;

DROP VIEW IF EXISTS `mensalidade`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mensalidade`  AS SELECT `f`.`id` AS `id`, `f`.`uuid` AS `uuid`, `f`.`titulo` AS `titulo`, `f`.`valor` AS `valor`, `f`.`dataVencimento` AS `dataVencimento`, `f`.`dataPagamento` AS `dataPagamento`, `f`.`anoCalendario` AS `anoCalendario`, `f`.`statusFinanceiro` AS `statusFinanceiro`, `f`.`tipo` AS `tipo`, `f`.`observacao` AS `observacao`, `f`.`comprovante` AS `comprovante`, `f`.`idUnidade` AS `idUnidade` FROM `financeiro` AS `f` WHERE (`f`.`idUnidade` is not null) ;

-- --------------------------------------------------------

--
-- Estrutura para view `sindicoscompleto`
--
DROP TABLE IF EXISTS `sindicoscompleto`;

DROP VIEW IF EXISTS `sindicoscompleto`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `sindicoscompleto`  AS SELECT `s`.`id` AS `id`, `s`.`uuid` AS `uuid`, `s`.`nome` AS `nome`, `s`.`email` AS `email`, `s`.`cpf` AS `cpf`, `s`.`contato` AS `contato`, `s`.`dataEntrada` AS `dataEntrada`, `s`.`dataSaida` AS `dataSaida`, `s`.`imagemPerfil` AS `imagemPerfil`, `s`.`observacao` AS `observacao`, `s`.`tipo` AS `tipo`, `s`.`ativo` AS `ativo`, `s`.`idCondominio` AS `idCondominio`, `s`.`idEndereco` AS `idEndereco`, `c`.`nome` AS `nomeCondominio`, concat(`e`.`rua`,', ',`e`.`numero`,if((`e`.`complemento` is not null),concat('. (',`e`.`complemento`,'). '),'. '),`e`.`bairro`,'. ',`e`.`cidade`,', ',`e`.`uf`,'. ',`e`.`pais`,'. CEP: ',`e`.`cep`) AS `endereco` FROM ((`sindico` `s` left join `condominio` `c` on((`c`.`id` = `s`.`idCondominio`))) left join `endereco` `e` on((`e`.`id` = `s`.`idEndereco`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `unidadeblocosdistinct`
--
DROP TABLE IF EXISTS `unidadeblocosdistinct`;

DROP VIEW IF EXISTS `unidadeblocosdistinct`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `unidadeblocosdistinct`  AS SELECT DISTINCT `u`.`bloco` AS `label` FROM `unidade` AS `u` ;

-- --------------------------------------------------------

--
-- Estrutura para view `unidadescompletas`
--
DROP TABLE IF EXISTS `unidadescompletas`;

DROP VIEW IF EXISTS `unidadescompletas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `unidadescompletas`  AS SELECT `u`.`id` AS `id`, `u`.`bloco` AS `bloco`, `u`.`numero` AS `numero`, `u`.`observacao` AS `observacao`, `u`.`idCondominio` AS `idCondominio`, `c`.`nome` AS `nomeCondominio` FROM (`unidade` `u` left join `condominio` `c` on((`c`.`id` = `u`.`idCondominio`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `usuarioscondominos`
--
DROP TABLE IF EXISTS `usuarioscondominos`;

DROP VIEW IF EXISTS `usuarioscondominos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `usuarioscondominos`  AS SELECT `u`.`id` AS `id`, `u`.`nomeusuario` AS `nomeusuario`, `u`.`tipo` AS `tipo`, `u`.`ativo` AS `ativo`, `u`.`lastIP` AS `lastIP`, `u`.`lastLogin` AS `lastLogin`, `u`.`idPessoa` AS `idPessoa`, `c`.`uuid` AS `uuid`, `c`.`nome` AS `nome`, `c`.`email` AS `email`, `c`.`cpf` AS `cpf`, `c`.`contato` AS `contato`, `c`.`dataEntrada` AS `dataEntrada`, `c`.`dataSaida` AS `dataSaida`, `c`.`imagemPerfil` AS `imagemPerfil`, `c`.`observacao` AS `observacao`, `c`.`proprietario` AS `proprietario`, `c`.`tipo` AS `tipoPessoa`, `c`.`ativo` AS `pessoaAtiva`, `c`.`idUnidade` AS `idUnidade`, `c`.`bloco` AS `bloco`, `c`.`numero` AS `numero`, `c`.`observacao` AS `observacaoUnidade`, `con`.`id` AS `idCondominio`, `con`.`nome` AS `nomeCondominio` FROM ((`usuario` `u` join `condominocompleto` `c` on(((`u`.`idPessoa` = `c`.`id`) and (`u`.`tipo` = `c`.`tipo`)))) join `condominio` `con` on((`con`.`id` = `c`.`idCondominio`))) ;

-- --------------------------------------------------------

--
-- Estrutura para view `usuariossindicos`
--
DROP TABLE IF EXISTS `usuariossindicos`;

DROP VIEW IF EXISTS `usuariossindicos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `usuariossindicos`  AS SELECT `u`.`id` AS `id`, `u`.`nomeusuario` AS `nomeusuario`, `u`.`tipo` AS `tipo`, `u`.`ativo` AS `ativo`, `u`.`lastIP` AS `lastIP`, `u`.`lastLogin` AS `lastLogin`, `u`.`idPessoa` AS `idPessoa`, `s`.`uuid` AS `uuid`, `s`.`nome` AS `nome`, `s`.`email` AS `email`, `s`.`cpf` AS `cpf`, `s`.`contato` AS `contato`, `s`.`dataEntrada` AS `dataEntrada`, `s`.`dataSaida` AS `dataSaida`, `s`.`imagemPerfil` AS `imagemPerfil`, `s`.`observacao` AS `observacao`, `s`.`ativo` AS `pessoaAtiva`, `s`.`tipo` AS `tipoPessoa`, `c`.`nome` AS `nomeCondominio` FROM ((`usuario` `u` join `sindico` `s` on(((`u`.`idPessoa` = `s`.`id`) and (`u`.`tipo` = `s`.`tipo`)))) join `condominio` `c` on((`c`.`id` = `s`.`idCondominio`))) ;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `aviso`
--
ALTER TABLE `aviso`
  ADD CONSTRAINT `Aviso_FK` FOREIGN KEY (`idSsindico`) REFERENCES `sindico` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Aviso_FK_1` FOREIGN KEY (`idAutor`) REFERENCES `condomino` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `condominio`
--
ALTER TABLE `condominio`
  ADD CONSTRAINT `Condominio_FK` FOREIGN KEY (`idEndereco`) REFERENCES `endereco` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `condomino`
--
ALTER TABLE `condomino`
  ADD CONSTRAINT `Condomino_FK` FOREIGN KEY (`idUnidade`) REFERENCES `unidade` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `financeiro`
--
ALTER TABLE `financeiro`
  ADD CONSTRAINT `Pagamento_FK` FOREIGN KEY (`idUnidade`) REFERENCES `unidade` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `ocorrencia`
--
ALTER TABLE `ocorrencia`
  ADD CONSTRAINT `Ocorrencia_FK` FOREIGN KEY (`idUnidade`) REFERENCES `unidade` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Ocorrencia_FK_1` FOREIGN KEY (`idSindico`) REFERENCES `sindico` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Ocorrencia_FK_2` FOREIGN KEY (`idMorador`) REFERENCES `condomino` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Ocorrencia_FK_3` FOREIGN KEY (`idProfissional`) REFERENCES `profissional` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `profissional`
--
ALTER TABLE `profissional`
  ADD CONSTRAINT `Profissional_FK` FOREIGN KEY (`idEndereco`) REFERENCES `endereco` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `sindico`
--
ALTER TABLE `sindico`
  ADD CONSTRAINT `Sindico_FK` FOREIGN KEY (`idCondominio`) REFERENCES `condominio` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Sindico_FK_1` FOREIGN KEY (`idEndereco`) REFERENCES `endereco` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `unidade`
--
ALTER TABLE `unidade`
  ADD CONSTRAINT `Unidade_FK` FOREIGN KEY (`idCondominio`) REFERENCES `condominio` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
