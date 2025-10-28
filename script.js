//Configuração da API

const API_URL = "https://69010550ff8d792314bc5118.mockapi.io/farmacia_api";

const catalogo_container = document.querySelector("#catalogo_remedios");
const pedidos_container = document.querySelector("#lista_pedidos");

//Função de ler os remedios

async function buscar_remedios() {
    console.log("Buscando remedios...");
    try{
        const response = await fetch(`${API_URL}/remedios`);

        const remedios = await response.json();

        console.log("Remedios encontrados:", remedios);

        //Limpar o container, para evitar duplicidade
        catalogo_container.innerHTML = "";

        remedios.forEach(remedios => {
            const card = document.createElement('div');
            card.classList.add('remedio_card');

            card.innerHTML = `
            <img src='${remedios.imagem}' alt='${remedios.name}'>
            <h3>${remedios.name}</h3>
            <p class='preco'>${remedios.preco}</p>
            <button onClick="abrirFormularioPedido('${remedios.id}', '${remedios.name}', '${remedios.preco}')">Fazer Pedido</button>
            `;
        })
    }catch (error) {
        console.error("Erro ao buscar remedios", error);
        catalogo_container.innerHTML = "<p>Erro ao carregar catalogo</p>";
    }
    
}

//CRIAR

function abrirFormularioPedido(id, nome, preco){
    console.log(`Abrindo formulário para: ${nome}(ID: ${id}, Preço: ${preco})`);

    alert("Você selecionou: ${nome}");
}

buscar_remedios();