# Doces Vitrine - Frontend

Projeto frontend para o desafio técnico "Doces Vitrine" consumindo a API oficial.

## Tecnologias e Arquitetura
- **React (Vite)**
- **React Hook Form & Zod** para gerenciar formulários e validação.
- **Axios** para consumo de API.
- **Context API** para gerenciar o estado global de autenticação.
- **Rotas Protegidas** garantindo que o dashboard seja apenas para usuários autenticados.

## Configuração

O projeto já está configurado para consumir a API oficial fornecida para o desafio em:
`https://knex.zernis.space`

Nenhum backend adicional é necessário.

## Como Executar o Projeto

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu computador.
2. Na raiz do projeto, instale as dependências executando o comando:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O link local (geralmente `http://localhost:5173/`) será exibido. Clique e acesse a aplicação!

## Funcionalidades
- Autenticação (Login e Registro)
- Exibição de produtos (Vitrine)
- Área administrativa protegida (Dashboard / Admin Produtos) com CRUD.
- Upload de imagens em dois passos (upload image -> associar `file_id` ao produto).
