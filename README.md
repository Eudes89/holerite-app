# Extração de Dados de Holerites e CCB

## 📌 Sobre o Projeto
Este projeto foi desenvolvido para a empresa **Família Soluções** com o objetivo de **extrair dados vitais** dos holerites e de documentos chamados CCB de seus clientes. Ele automatiza a leitura de arquivos PDF, organiza as informações e as converte em **planilhas do Excel**, facilitando a manipulação dos dados.

## 🚀 Como Funciona?
1. O usuário salva os documentos em suas respectivas pastas:
   - **/docs** → Para arquivos de holerites
   - **/ccbDocs** → Para arquivos CCB
2. Executando o arquivo `start.bat`, o programa:
   - Extrai os dados dos arquivos PDF
   - Converte os dados em tabelas organizadas
   - Salva os resultados em **arquivos Excel**
3. Os arquivos gerados podem ser encontrados na pasta **/excel_file**, prontos para edição ou análise.

## 🛠️ Tecnologias e Bibliotecas Utilizadas
- **pdfReader** `v3.0.5`
- **xlsx** `v0.18.5`

## 🔧 Estrutura e Funções Principais
O projeto contém os seguintes arquivos e funções:

### `extractDataPdf_padrao.mjs`
Lida com documentos **holerite** e contém quatro funções principais:
- **readPdfFile(caminhoDoArquivo)** → Lê e extrai os dados do PDF, retornando os campos como `string`.
- **extractDataPdf(caminhoDoArquivo, id)** → Organiza os dados extraídos em um objeto estruturado.
- **sanitizeData(dado)** → Faz o tratamento necessário para padronizar os valores extraídos.
- **convertToExcel(objeto, arquivo, tipo)** → Salva os dados organizados em um arquivo Excel.

### `extractDataCcb.mjs`
Realiza o mesmo processo do `extractDataPdf_padrao.mjs`, mas para documentos **CCB** e salva os dados em um Excel específico.

### `init.mjs`
- É executado quando o usuário clica no arquivo `start.bat`.
- Processa todos os documentos armazenados nas pastas.
- Exibe uma mensagem no **prompt de comando** ao finalizar e encerra automaticamente o programa.

## 📂 Organização dos Arquivos
```
📂 MeuProjeto
 ├── 📂 docs
 ├── 📂 ccbDocs
 ├── 📂 excel_file
 ├── 📝 extractDataPdf_padrao.mjs
 ├── 📝 extractDataCcb.mjs
 ├── 📝 init.mjs
 ├── 📝 start.bat
 ├── 📝 README.md
```

## 🎯 Como Usar?
1. **Coloque os arquivos PDF** nas pastas correspondentes.
2. **Execute o arquivo** `start.bat`.
3. **Acesse os resultados** na pasta `/excel_file` e edite conforme necessário.

## 🏆 Autor e Licença
Este programa foi criado para **extrair rapidamente dados importantes** dos holerites da empresa **Padrão**, que possui milhares de funcionários. Para que funcione com outros tipos de holerites, **modificações** precisam ser feitas nas funções para garantir a extração precisa dos dados.

O projeto foi desenvolvido do zero por **Eudes Azevedo** e é um **projeto open source**, permitindo sua cópia e modificação.

Caso precisem de auxílio ou ajuda, fiquem à vontade para **entrar em contato** pelo e-mail: `eudesazevedo@hotmail.com`
