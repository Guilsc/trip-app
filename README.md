# Trip App - Aplicação de Gerenciamento de Viagens

Uma aplicação moderna para gerenciamento de viagens construída com Vue 3, Quasar Framework e TypeScript.

## 🚀 Funcionalidades

- **Autenticação completa**: Login e registro de usuários
- **Interface moderna**: Design responsivo com Quasar Framework
- **Validação de formulários**: Validação em tempo real
- **Navegação protegida**: Rotas protegidas por autenticação
- **Notificações**: Feedback visual para o usuário
- **Persistência de sessão**: Token armazenado no localStorage

## 🛠️ Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Quasar Framework** - Framework Vue com componentes Material Design
- **TypeScript** - Tipagem estática para JavaScript
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool e dev server

## 📦 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd trip-app
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse a aplicação em `http://localhost:5173`

## 🐳 Rodando com Docker

Alternativamente, você pode executar a aplicação usando Docker.

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Execute o seguinte comando na raiz do projeto:

    ```bash
    docker-compose up -d
    ```

3.  A aplicação estará disponível em `http://localhost:5173`.

## 🔧 Configuração da API

A aplicação está configurada para conectar com uma API local na porta 8000. Certifique-se de que sua API esteja rodando em `http://localhost:8000`.

### Endpoints esperados:

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/me` - Obter dados do usuário atual

## 📱 Telas

### Login (`/login`)

- Formulário de login com validação
- Campo de email e senha
- Opção "Lembrar de mim"
- Link para registro

### Registro (`/register`)

- Formulário de registro com validação completa
- Campos: nome, email, senha, confirmação de senha
- Validação de força da senha
- Aceitação de termos

### Home (`/`)

- Tela de boas-vindas após login
- Cards de navegação para funcionalidades
- Menu de usuário no header

## 🔐 Autenticação

O sistema de autenticação inclui:

- **Store de autenticação** (`src/stores/auth.ts`)
- **Guards de navegação** - Proteção de rotas
- **Persistência de token** - Armazenamento no localStorage
- **Validação de sessão** - Verificação automática de autenticação

## 🎨 Design

- **Tema moderno** com gradientes e efeitos de vidro
- **Componentes Quasar** para interface consistente
- **Responsivo** - Funciona em desktop e mobile
- **Animações suaves** - Transições e hover effects

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Estilos globais
├── components/      # Componentes Vue
├── router/          # Configuração de rotas
├── stores/          # Stores Pinia
├── views/           # Páginas da aplicação
└── main.ts          # Ponto de entrada
```

## 🚀 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código
- `npm run format` - Formatação do código

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente suas mudanças
4. Execute os testes: `npm run test:unit`
5. Faça commit das mudanças
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
