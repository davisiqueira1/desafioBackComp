# desafioBackComp

## Visão geral

Como desafio do backend, escolhi implementar um sistema de biblioteca universitária.<br> 
O backend pode ser testado de 2 formas:
- Por requisição (através de ferramentas como Postman, Insomnia, etc...)
- Pelo frontend
<br>

O projeto possui 3 entidades:
- Livro
- Gênero
- Usuário (com ou sem permissão de administrador)
<br>

O usuário com permissão de administrador pode fazer o CRUD completo de livro, gênero e usuário.<br>
O usuário sem permissão de administrador pode apenas listar os livros e os gêneros.

## Rotas
### Admin

| Método  | Caminho da rota          | Entidade#Ação    | Descrição
|---------| -------------------------|------------------|--------
| GET     | /admin                   |                  | Mostra uma página html com o painel de opções para o administrador
| GET     | /admin/generos           | Genero#Listar       | Mostra uma página html com todos os gêneros registrados no banco de dados
| POST    | /admin/generos/novo      | Genero#Criar     | Recebe os dados do formulário de registro e faz o registro do novo gênero no banco de dados
| GET     | /admin/generos/add       |                  | Mostra uma página html com um formulário para adicionar um novo gênero
| GET     | /admin/generos/edit/:id  |                  | Mostra uma página html com um formulário para editar um gênero já registrado
| POST    | /admin/generos/edit      | Genero#Editar    | Recebe os dados do formulário de edição e faz a atualização do gênero no banco de dados
| POST    | /admin/generos/deletar   | Genero#Deletar   | Recebe o identificador de um gênero e o deleta do banco de dados
| GET     | /admin/livros            | Livro#Listar        | Mostra uma página html com todos os livros registrados no banco de dados
| GET     | /admin/livros/add        |                  | Mostra uma página html com um formulário para adicionar um novo livro
| POST    | /admin/livros/novo       | Livro#Criar      | Recebe os dados do formulário de registro e faz o registro do novo livro no banco de dados
| GET     | /admin/livros/edit/:id   |                  | Mostra uma página html com um formulário para editar um livro já registrado
| POST    | /admin/livros/edit       | Livro#Editar     | Recebe os dados do formulário de edição e faz a atualização do livro no banco de dados
| POST    | /admin/livros/deletar    | Livro#Deletar    | Recebe o identificador de um livro e o deleta do banco de dados
| GET     | /admin/usuarios          | Usuário#Listar      | Mostra uma página html com todos os usuários registrados no banco de dados
| GET     | /admin/usuarios/edit/:id |                  | Mostra uma página html com um formulário para editar um usuário já registrado
| POST    | /admin/usuarios/edit     | Usuário#Editar   | Recebe os dados do formulário de edição e faz a atualização do usuário no banco de dados
| POST    | /admin/usuarios/deletar  | Usuário#Deletar  | Recebe o identificador de um usuário e o deleta do banco de dados

### Usuário

| Método  | Caminho da rota          | Entidade#Ação    | Descrição
|---------| -------------------------|------------------|--------
| GET     | /usuario/registro        |                  | Mostra uma página html com um formulário para registro de usuário
| POST    | /usuario/registro        | Usuário#Criar    | Recebe os dados do formulário de registro e faz o registro do novo usuário no banco de dados
| GET     | /usuario/login           |                  | Mostra uma página html com um formulário para login de usuário
| POST    | /usuario/login           |                  | Recebe os dados do formulário de login e faz a autenticação do usuário
| GET     | /usuario/logout          |                  | Desloga o usuário

### /

| Método  | Caminho da rota          | Entidade#Ação    | Descrição
|---------| -------------------------|------------------|--------
| GET     | /                        | Livro#Listar     | Mostra uma página html com a listagem de todos os livros e um botão de cadastro
| GET     | /livro/:id               | Livro#Listar    | Mostra uma página html com detalhes de um livro específico
| GET     | /generos                 | Genero#Listar    | Mostra uma página html com a listagem de todos os gêneros
| GET     | /generos/:id             | Genero#Listar    | Mostra uma página html com a listagem de todos os livros de um gênero específico
| GET     | /404                     |                   | Mostra uma página html de erro


## Como rodar

1. É preciso ter o Node.JS instalado.
2. Rode o comando "npm i" no diretório para baixar as dependências
3. Rode o comando "npm run serve" para inicializar o projeto junto com o nodemon
