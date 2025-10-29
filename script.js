//Configuração da API

const API_URL = "https://69010550ff8d792314bc5118.mockapi.io/farmacia_api";

const catalogo_container = document.querySelector("#catalogo_remedios");
const pedidos_container = document.querySelector("#lista_pedidos");
const modal_overlay = document.querySelector('#modal_pedidos_overlay');
const form_pedidos =  document.querySelector('#form_pedidos');
const btn_cancelar = document.querySelector('#cancela_pedido');
const form_remedio_nome = document.querySelector('#form_remedio_nome');
const form_remedio_id_hidden = document.querySelector('#form_remedio_id_hidden');
const form_remedio_preco_hidden = document.querySelector('#form_remedio_preco');
const form_nome_cliente = document.querySelector('#nome_cliente');
const form_email_cliente = document.querySelector('#email_cliente');


//Função de ler os remedios

async function buscar_remedios() {
    console.log("Buscando remedios...");
    try{
        const response = await fetch(`${API_URL}/remedios`);

        const remedios = await response.json();

        console.log("Remedios encontrados:", remedios);

        //Limpar o container, para evitar duplicidade
        catalogo_container.innerHTML = "";

        remedios.forEach(remedio => {
            const card = document.createElement('div');
            card.classList.add('remedio_card');

            card.innerHTML = `
            <img src='${remedio.avatar}' alt='${remedio.name}'>
            <h3>${remedio.name}</h3>
            <p class='preco'>${remedio.preco}</p>
            <button onclick="abrirFormularioPedido('${remedio.id}', '${remedio.name}', '${remedio.preco}')">Fazer Pedido</button>
            `;
            catalogo_container.append(card);
        })
    }catch (error) {
        console.error("Erro ao buscar remedios", error);
        catalogo_container.innerHTML = "<p>Erro ao carregar catalogo</p>";
    }
    
}

//CRIAR MODAL

function abrirFormularioPedido(id, nome, preco){
    console.log(`Abrindo formulário para: ${nome}`);
    form_remedio_nome.textContent = nome;
    form_remedio_id_hidden.value = id;
    form_remedio_preco_hidden.value = preco;

    modal_overlay.classList.remove('modal_hidden');
}

//FECHAR MODAL

function fechar_formulario(){
    modal_overlay.classList.add('modal_hidden'); //esconde o modal

    //limpa o campo cliente para a proxima vez
    form_nome_cliente.value = '';
    form_email_cliente.value = '';
}
btn_cancelar.addEventListener('click', fechar_formulario);

//Função para submit

async function criar_pedido(event) {
    event.preventDefault(); //impede o carregamento da pegina
    console.log('Enviando pedido...');

    //Guarda os dados fornecidos
    const dados_pedidos = {
        remedio_nome: form_remedio_nome.textContent,
        remedio_preco: form_remedio_preco_hidden.value,
        nome_cliente: form_nome_cliente.value,
        email_cliente: form_email_cliente.value
    };

    console.log('Dados do pedido', dados_pedidos);

    //Envia os dados para a API e fazer pedido

    try{
        const response = await fetch(`${API_URL}/pedidos`,{
            method:'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(dados_pedidos)
        });
        if (!response.ok){
            throw new Error ('Erro ao criar pedido');
        }

        const pedido_criado = await response.json();
        console.log('Pedido criado', pedido_criado);

        alert('PEDIDO REALIZADO COM SUCESSO!');
        fechar_formulario();

        buscar_pedidos();
        
    }catch(error){
            console.error('Erro no POST do pedido:', error);
            alert('Falha ao realizar pedido. Tente novamente');
                        
    }
}

form_pedidos.addEventListener('submit', criar_pedido);



//Ler pedidos e fazer eles aparecerem pro usuário

async function buscar_pedidos() {
    console.log('Buscando pedidos na API...')
    try{
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();

        console.log('Pedidos encontrados:', pedidos)

        //limpa o conteiners de pedidos
        pedidos_container.innerHTML ='';

        pedidos.forEach(pedido =>{
            const card = document.createElement('div');
            card.classList.add('pedido_card'); //usa a classe do CSS

            card.innerHTML = `
            
                <h4>Pedidos de: ${pedido.nome_cliente}</h4>
                <p>Email: ${pedido.email_cliente}</p>
                <hr>
                <p><strong>Remedio:</strong>${pedido.remedio_nome}</p>
                <p><strong>Preço:</strong>${pedido.remedio_preco}</p>

                <button onclick = "deletar_pedido('${pedido.id}')">Cancelar pedido</button>
            `;
            pedidos_container.append(card);
        })
    }catch (error){
        console.error('Erro ao buscar pedidos:', error);
        pedidos_container.innerHTML = '<p> Erro ao carregar pedido</p>';
    }
}

//Função Deletar
async function deletar_pedido(id){
    console.log('Tentando deletar pedido...');

    //pergunta ao usuário se ele tem certeza
    const confirmando = confirm('Tem certeza que deseja cancelar esse pedido?');
    if (!confirmando){
        return;
    }

    try{
        const response = await fetch(`${API_URL}/pedidos/${id}`, {
            method: 'DELETE'
        })

        if(!response.ok){
            throw new Error('Erro ao deletar o pedido.');
        }

        console.log('Pedido deletado com sucesso!');
        alert('Pedido deletado com sucesso!')

        //atualizar lista
        buscar_pedidos();
    }catch (error){
        console.error('Erro ao deletar pedido:', error);
        alert('Falha ao cancelar o pedido. Tente novamente.');
    }
}

buscar_remedios();
buscar_pedidos();
