// Arquivo principal do servidor de aplicação de Check-in

// Importa a biblioteca Express (que já vem dentro do node), que será usada para criar o servidor e as rotas da API.
const express = require("express");

//mporta a biblioteca CORS, que permite que seu front-end faça requisições para o servidor sem que o navegador bloqueie a comunicação.
const cors = require("cors");

// Criar a aplicação express do servidor.
// Vai renderizar o express para mim
const app =  express();
// Definindo a porta onde o servidor irá rodar.
const PORT = 3000;

// Configuração inicial da API
app.use(cors()) //Permite que o front acesse esta API.
app.use(express.json()); //Permite ler dados em formto JSON enviados no corpo da requisição.

// Armazenamento temporário dos participantes. Neste exemplo os dados que ficam em memória enquanto o servidor estiver rodando.
let participantes = []; //Guarda a lista de participantes cadastrados
let proximoId = 1; // Controla o próximo ID que será usado para cada participante.

//Rota para listar todos os participantes já cadastrados
app.get("/participantes", (req, res) =>{
res.json(participantes); //Envia a lista de participantes para o frontend
})


// Rota responsável por registrar um novo nome/check-in
// O frontend envia o nome do participante no corpo da requisição
app.post("/checkin", (req, res) => {
const { nome } = req.body; // Pega o nome enviado pelo front

    //verificar se o nome foi informado antes de registrar
    if (!nome || !nome.trim()){
        return res.status(400).json({
sucesso: false,
mensagem: "O nome é obrigatório para realizar o Check-in,"
        }); //Retorna erro se o nome estiver vazio ou com erro.
    }
    const novoParticipante = {
        id: proximoId++, //Gere um ID novo para cada participante
        nome: nome.trim(), //Remover espaços extras no nome
        horario: new Date().toISOString, // registra o horário especifico do check-in
    };

participantes.push(novoParticipante) //Add o novo participante a lista.

console.log(`Check-in confirmado: ${novoParticipante.nome}`) //Mostra no terminal que o check-in foi feito

res.status(201).json({
    sucesso: true,
    mensagem: `Check-in confiramdo com sucesso, ${novoParticipante.nome}!`, //Envia a mensagem de sucesso para o front-end
    participante: novoParticipante, //Envia os dados do participante criado
    total: participantes.length, //Envia a quantidade total de participantes.
}); 

});

app.get("/", (req, res) => {
    res.send("API de check-in de eventos rodando"); //Responde com uma mensagem simples para testar a API
});

app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`); //Inicia o servidor na porta definida
});



