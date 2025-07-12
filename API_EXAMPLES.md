# Exemplos de Uso da API

Este documento mostra como a aplicação se conecta com a API de gerenciamento de viagens.

## 🔗 Endpoints da API

### Autenticação

#### Login

```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de sucesso:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@exemplo.com"
  }
}
```

#### Registro

```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de sucesso:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "usuario@exemplo.com"
  }
}
```

#### Verificar Usuário Atual

```http
GET http://localhost:8000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta de sucesso:**

```json
{
  "id": 1,
  "name": "João Silva",
  "email": "usuario@exemplo.com"
}
```

## 🔧 Configuração da Aplicação

A aplicação está configurada para se conectar automaticamente com a API em `http://localhost:8000`. O token de autenticação é armazenado no localStorage e enviado automaticamente em todas as requisições autenticadas.

### Headers Automáticos

Após o login, a aplicação configura automaticamente o header de autorização:

```javascript
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

## 📝 Exemplos de Uso no Código

### Login

```javascript
const result = await authStore.login({
  email: 'usuario@exemplo.com',
  password: 'senha123',
})

if (result.success) {
  // Login bem-sucedido
  console.log('Usuário logado:', authStore.user)
} else {
  // Erro no login
  console.error('Erro:', result.error)
}
```

### Registro

```javascript
const result = await authStore.register({
  name: 'João Silva',
  email: 'usuario@exemplo.com',
  password: 'senha123',
})

if (result.success) {
  // Registro bem-sucedido
  console.log('Usuário registrado:', authStore.user)
} else {
  // Erro no registro
  console.error('Erro:', result.error)
}
```

### Verificar Autenticação

```javascript
const isAuthenticated = await authStore.checkAuth()
if (isAuthenticated) {
  console.log('Usuário autenticado:', authStore.user)
} else {
  console.log('Usuário não autenticado')
}
```

### Logout

```javascript
authStore.logout()
// Token removido e usuário deslogado
```

## 🚨 Tratamento de Erros

A aplicação trata automaticamente os seguintes tipos de erro:

- **401 Unauthorized**: Token inválido ou expirado
- **422 Validation Error**: Dados de formulário inválidos
- **500 Internal Server Error**: Erro interno do servidor

### Exemplo de Resposta de Erro

```json
{
  "message": "Credenciais inválidas",
  "errors": {
    "email": ["Email é obrigatório"],
    "password": ["Senha é obrigatória"]
  }
}
```

## 🔒 Segurança

- Tokens são armazenados no localStorage
- Headers de autorização são configurados automaticamente
- Sessões são verificadas em cada navegação
- Logout limpa todos os dados de autenticação

## 📱 Testando a API

Você pode testar a API usando:

1. **Postman** ou **Insomnia**
2. **cURL** no terminal
3. **Documentação da API** em `http://localhost:8000/api/documentation`

### Exemplo com cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com","password":"senha123"}'

# Verificar usuário (com token)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
