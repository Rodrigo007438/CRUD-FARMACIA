#FARMACIA CRUD -   Prototipo de Gestão de Produtos (v1.0)

## 🚀 Sobre o Projeto

Este é um projeto de aplicação web CRUD (Creat, Read, Update, Delete) completo, construido com Javascript, HTML e CSS.

O projeto simula um portal interno de uma farmácia, onde é possível gerenciar um catálogo de remédios, controlar o estoque e processar os pedidos dos clientes. O objetivo principal foi contruir toda a lógica de negócios (CRUD, permissões, estoque) do zero, consumindo uma API REST simulada.

----

## ✨ Funcionalidades Principais

Este projeto implementa um ciclo de logica de negócios completo:

*Autenticação simulada:
    *pagina de login(`login.html`) que simula perfis de usuários: Gerente e Cliente.
    *Uso do `localStorage` para "lembrar" o perfil do usuário e proteger a pagina principal.

*Permissões dos usuários:
    *Gerentes: tem acesso total ao sistema, podem ver, cadastrar e excluir pedidos, no menu `Meus Pedidos`.
    *Clientes: tem acesso restrito, podem apenas ver a lista de remedios e cadastrar pedidos.

*Catálogo de Remédios (Read):
    * Busca (`fetch GET`) e exibe a lista de remédios de uma API.
    * Mostra o nome, preço, imagem e estoque atual de cada item.

*Criação de Pedidos (Create):
    * Abre um modal de formulário para o usuário inserir seus dados (nome, e-mail).
    * Envia (`fetch POST`) um novo "pedido" para a API.

*Gestão de Estoque (Update):
    * Ao criar um pedido, o sistema automaticamente faz um `fetch PUT` para o remédio correspondente, decrementando (-1) a quantidade do estoque.
    * Impede pedidos de itens com estoque zero.

*Cancelamento de Pedidos (Delete) e Estorno:**
    * (Disponível apenas para Gerentes) Permite cancelar um pedido.
    * Executa uma transação: primeiro faz um `fetch PUT` para estornar (+1) o item ao estoque, e depois faz um `fetch DELETE` para remover o pedido.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído "do zero" (sem frameworks) para focar nos fundamentos do desenvolvimento web:

*HTML5: Estrutura semântica (`<main>`, `<section>`, `<form>`).
*CSS3: Layouts modernos com Flexbox e CSS Grid, Media Queries para responsividade básica, e animações/transições.
*JavaScript (ES6+):
    *Async/Await para lidar com código assíncrono.
    *Fetch API para todas as operações CRUD (`GET`, `POST`, `PUT`, `DELETE`).
    *Manipulação do DOM: Criação dinâmica de elementos (`createElement`, `append`).
    *LocalStorage: Para simulação de autenticação e permissões.
*API:
    *MockAPI (mockapi.io) para simular um backend REST completo.

---

## 🚀 Como Executar

1.  Clone este repositório (ou baixe o .zip).
2.  Abra o arquivo `login.html` no seu navegador de preferência.
3.  Use um dos logins abaixo para testar:
    *Gerente: `admin` / `admin123`
    *Cliente: `cliente` / `cliente123`

**[🔗 Clique aqui para ver o projeto ao vivo](https://rodrigo007438.github.io/CRUD-FARMACIA/)**