
# Doces Vitrine - Frontend

Projeto frontend para o desafio técnico "Doces Vitrine" consumindo a API oficial.

## Tecnologias e Arquitetura
- **React (Vite)**
- **React Router DOM** para navegação entre páginas.
- **React Hook Form & Zod** para gerenciar formulários e validação.
- **Axios** para consumo de API.
- **Context API** para gerenciar o estado global de autenticação.
- **React Toastify** para exibição de notificações na interface.
- **JS Cookie** para armazenamento do token de autenticação.
- **Lucide React** para ícones da interface.
- **Rotas Protegidas** garantindo que o dashboard seja acessível apenas por usuários autenticados.

## Configuração

O projeto já está configurado para consumir a API oficial fornecida para o desafio em:
`https://knex.zernis.space`



## Como Executar o Projeto

11. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em seu computador.
2. Na raiz do projeto, instale as dependências executando o comando: `npm install`.
3. Inicie o servidor de desenvolvimento com o comando: `npm run dev`.
4. O link local ( `http://localhost:5173/`) será exibido. Clique e acesse a aplicação.

## Funcionalidades
- Autenticação (Login e Registro)
- Exibição de produtos (Vitrine)
- Área administrativa protegida (Dashboard / Admin Produtos)
- Cadastro, edição, visualização e exclusão de produtos (CRUD completo)
- Upload de imagens em dois passos (upload da imagem → associação do `file_id` ao produto)
- Notificações visuais de ações do sistema

# doces-vitrine
Projeto frontend Doces Vitrine desenvolvido para desafio técnico Knex.
