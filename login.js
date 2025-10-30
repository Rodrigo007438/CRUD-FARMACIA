//espera o HTML carregar
document.addEventListener('DOMContentLoaded', () =>{

    //formularios do login
    const form_login = document.querySelector('#form_login');
    const input_username = document.querySelector('#username');
    const input_password = document.querySelector('#password');

    form_login.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = input_username.value;
        const password = input_password.value;

        //Simulação

        if(username === 'admim' && password === 'admim123'){
            alert('Você entrou como Gerente');

            //Salva o perfil

            localStorage.setItem('perfil_usuario', 'gerente');

            //Redireciona para a pagina principal

            window.location.href = 'index.html';
        }else if(username === 'cliente' && password === 'cliente123'){
            alert('Você entrou como cliente');

            localStorage.setItem('perfil_usuario', 'cliente');

            window.location.href = 'index.html';

        }else{
            alert('Usuario incorreto');
        }
    })
})