//Identificando usuario
perfil_logado = localStorage.getItem('perfil_usuario');

if(perfil_logado === 'gerente'){
    document.body.classList.add('perfil_gerente');
    console.log('Status:Logado como gerente');
}else if(perfil_logado === 'cliente'){
    document.body.classList.add('perfil_cliente');
    console.log('Status: Logado como cliente');
}else{
    alert('Você precisa fazer login para acessar essa pagina.');

    window.location.href = 'login.html';
}


// --- 1. CONFIGURAÇÃO DA API ---
const API_URL = "https://69010550ff8d792314bc5118.mockapi.io/farmacia_api";

// --- 2. SELETORES (Todos aqui) ---
const catalogo_container = document.querySelector("#catalogo_remedios");
const pedidos_container = document.querySelector("#lista_pedidos");
const modal_overlay = document.querySelector('#modal_pedidos_overlay');
const form_pedidos = document.querySelector('#form_pedidos');
const btn_cancelar = document.querySelector('#cancela_pedido');
const form_remedio_nome = document.querySelector('#form_remedio_nome');
const form_remedio_id_hidden = document.querySelector('#form_remedio_id_hidden');
const form_remedio_preco_hidden = document.querySelector('#form_remedio_preco');
const form_nome_cliente = document.querySelector('#nome_cliente');
const form_email_cliente = document.querySelector('#email_cliente');

let remedios_lista_global = [];

// O "COFRE" DO ESTOQUE (que você acabou de adicionar no HTML)
const form_remedio_estoque_hidden = document.querySelector('#form_remedio_estoque_hidden');


// --- 3. FUNÇÃO DE LER REMÉDIOS (READ) ---
async function buscar_remedios() {
    console.log("Buscando remedios...");
    try {
        const response = await fetch(`${API_URL}/remedios`);
        const remedios = await response.json();
        const total_remedios = remedios.length;
        remedios_lista_global = remedios;
        console.log(`Total de remedios no catalogo: ${total_remedios}`); // Corrigido: crase no console
        console.log("Remedios encontrados:", remedios);
        catalogo_container.innerHTML = "";

        remedios.forEach(remedio => {
            const card = document.createElement('div');
            card.classList.add('remedio_card');

            // (Use 'remedio.imagem_url' se você atualizou no MockAPI, senão 'remedio.avatar')
            card.innerHTML = `
                <img src='${remedio.imagem_url || remedio.avatar}' alt='${remedio.name}'> 
                <h3>${remedio.name}</h3>
                <p class='preco'>${remedio.preco}</p>
                <p><strong>Estoque: ${remedio.quantidade_estoque}</strong></p> 
                <button onclick="abrirFormularioPedido('${remedio.id}', '${remedio.name}', '${remedio.preco}', ${remedio.quantidade_estoque})">Fazer Pedido</button>
            `;
            catalogo_container.append(card);
        });
    } catch (error) {
        console.error("Erro ao buscar remedios", error);
        catalogo_container.innerHTML = "<p>Erro ao carregar catalogo</p>";
    }
}

// --- 4. FUNÇÕES DO MODAL ---
function abrirFormularioPedido(id, nome, preco, quantidade) {
    console.log(`Abrindo formulário para: ${nome}, Estoque: ${quantidade}`);
    
    if (quantidade <= 0) {
        alert('Desculpe, este item está fora de estoque');
        return;
    }
    
    // Preenche os campos
    form_remedio_nome.textContent = nome;
    form_remedio_id_hidden.value = id;
    form_remedio_preco_hidden.value = preco;
    
    // GUARDA O ESTOQUE ATUAL NO "COFRE"
    form_remedio_estoque_hidden.value = quantidade;

    modal_overlay.classList.remove('modal_hidden');
}

function fechar_formulario() {
    modal_overlay.classList.add('modal_hidden');
    form_nome_cliente.value = '';
    form_email_cliente.value = '';
}
btn_cancelar.addEventListener('click', fechar_formulario);

// --- 5. FUNÇÃO DE ENVIAR (CREATE & UPDATE) ---
async function criar_pedido(event) {
    event.preventDefault(); 
    console.log('Enviando pedido...');

    // Pega os dados do formulário
    const dados_pedidos = {
        remedio_nome: form_remedio_nome.textContent,
        remedio_preco: form_remedio_preco_hidden.value,
        nome_cliente: form_nome_cliente.value,
        email_cliente: form_email_cliente.value
    };
    
    // Pega os dados do "cofre" para o UPDATE
    const remedio_id = form_remedio_id_hidden.value;
    const estoque_atual = Number(form_remedio_estoque_hidden.value); // Converte para número

    // CALCULA O NOVO ESTOQUE
    const novo_estoque = estoque_atual - 1;

    console.log('Dados do pedido:', dados_pedidos);
    console.log(`Estoque antigo: ${estoque_atual}, Novo estoque: ${novo_estoque}`);

    try {
        // 1. CRIA O PEDIDO (POST)
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados_pedidos)
        });

        if (!response.ok) {
            throw new Error('Erro ao criar pedido');
        }

        const pedido_criado = await response.json();
        console.log('Pedido criado', pedido_criado);

        // 2. ATUALIZA O ESTOQUE (PUT)
        await atualizar_estoque(remedio_id, novo_estoque);

        // 3. ATUALIZA A TELA
        alert('PEDIDO REALIZADO COM SUCESSO!');
        fechar_formulario();
        buscar_pedidos();   // Atualiza a lista de pedidos
        buscar_remedios();  // Atualiza o catálogo (para mostrar o novo estoque)
        
    } catch (error) {
        console.error('Erro no POST do pedido:', error);
        alert('Falha ao realizar pedido. Tente novamente');
    }
}
form_pedidos.addEventListener('submit', criar_pedido);

// --- 6. FUNÇÃO DE ATUALIZAR ESTOQUE (PUT) ---
async function atualizar_estoque(id, nova_quantidade) {
    console.log(`Atualizando estoque do remedio ${id} para ${nova_quantidade}`);
    try {
        await fetch(`${API_URL}/remedios/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' }, // Corrigido
            body: JSON.stringify({ quantidade_estoque: nova_quantidade })
        });
    } catch (error) {
        console.error('Erro ao atualizar o estoque:', error);
        // Em um app real, teríamos que "desfazer" o pedido aqui.
        alert('Erro: O pedido foi criado, mas falhamos ao atualizar o estoque.');
    }
}


// --- 7. FUNÇÃO DE LER PEDIDOS (READ) ---
async function buscar_pedidos() {
    console.log('Buscando pedidos na API...');
    try {
        const response = await fetch(`${API_URL}/pedidos`);
        const pedidos = await response.json();
        console.log('Pedidos encontrados:', pedidos);

        pedidos_container.innerHTML = ''; // Limpa

        pedidos.forEach(pedido => {

            const remedio_correspondente = remedios_lista_global.find(
                (remedio) => remedio.name === pedido.remedio_nome
            );

            if(!remedio_correspondente){
                console.warn(`Remedio '${pedido.remedio_nome}' não encontrado no catalogo`);
                return;
            }

            const remedio_id = remedio_correspondente.id;
            const remedio_estoque_atual = remedio_correspondente.quantidade_estoque;

            const card = document.createElement('div');
            card.classList.add('pedido_card'); 
            card.innerHTML = `
                <h4>Pedido de: ${pedido.nome_cliente}</h4>
                <p>Email: ${pedido.email_cliente}</p>
                <hr>
                <p><strong>Remedio:</strong>${pedido.remedio_nome}</p>
                <p><strong>Preço:</strong>${pedido.remedio_preco}</p>
                <button onclick="deletar_pedido('${pedido.id}', '${remedio_id}', '${remedio_estoque_atual}')">Cancelar pedido</button>
            `;
            pedidos_container.append(card);
        });
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        pedidos_container.innerHTML = '<p> Erro ao carregar pedido</p>';
    }
}

// --- 8. FUNÇÃO DE DELETAR (DELETE) ---
async function deletar_pedido(pedido_id, remedio_id, estoque_atual) {
    console.log(`Tentando deletar pedido ${pedido_id}... Estornando remedio ${remedio_id}`);
    const confirmando = confirm('Tem certeza que deseja cancelar esse pedido? O item voltará ao estoque');
    if (!confirmando) {
        return;
    }

    const novo_estoque = Number(estoque_atual) + 1;

    try {
        await atualizar_estoque(remedio_id, novo_estoque);

        const response = await fetch(`${API_URL}/pedidos/${pedido_id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar o pedido.');
        }
        console.log('Pedido deletado com sucesso!');
        alert('Pedido deletado com sucesso!');
        buscar_pedidos(); // Atualiza a lista
        buscar_remedios();
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        alert('Falha ao cancelar o pedido. Tente novamente.');
    }
}


// --- 9. INICIALIZAÇÃO ---
buscar_remedios();

if(perfil_logado === 'gerente'){
buscar_pedidos();
}