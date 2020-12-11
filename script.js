let reiniciarHistorico = () => {
    localStorage.clear();
    window.location.reload();
}

let preencherTabela = () => {
    localStorage.getItem("totalPartidas") || localStorage.setItem("totalPartidas", 0);
    localStorage.getItem('historico') || localStorage.setItem("historico", '[]');

    let historico =  JSON.parse(localStorage.getItem('historico'));

    var table = document.getElementById("table-historico");

    for ( indice in historico){
        let partida = historico[indice];
        
        var row = table.insertRow(parseInt(indice) + 1);
    
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell1.innerHTML = partida.numero;
        cell2.innerHTML = partida.jogador1;
        cell3.innerHTML = partida.jogador2;
        cell4.innerHTML = partida.resultado;
    }
}

let salvarJogadores = () => {
    
    let PrimeiroJogador = document.getElementsByClassName("jogador1");
    
    let SegundoJogador = document.getElementsByClassName("jogador2");

    if ( PrimeiroJogador[1].value == SegundoJogador[1].value )
        alert("Os jogadores não podem escolher o MESMO SIMBOLO");
    else if ( PrimeiroJogador[0].value == SegundoJogador[0].value ) {
        alert("Os jogadores não podem escolher o MESMO NOME");
    } else {
        localStorage.setItem("nomeJogador1", PrimeiroJogador[0].value);
        localStorage.setItem("simboloJogador1", PrimeiroJogador[1].value);

        localStorage.setItem("nomeJogador2", SegundoJogador[0].value);
        localStorage.setItem("simboloJogador2", SegundoJogador[1].value); 
        IniciarJogo();
    }  
}

let IniciarJogo = () => {

    document.getElementsByClassName("jogo-content")[0].style.display = "flex";
    document.getElementsByClassName("placar")[0].style.display = "flex";
    document.getElementsByClassName("inicio")[0].style.display = "none";
    document.getElementsByClassName("historico")[0].style.display = "none";
    
    document.getElementById("versus").innerHTML = localStorage.getItem("nomeJogador1") + " VS " + localStorage.getItem("nomeJogador2");
    
    localStorage.setItem("rodadasJogadas", 0);
    localStorage.setItem("vitoriasJogador1", 0);
    localStorage.setItem("vitoriasJogador2", 0);
    localStorage.setItem("empates", 0);

    iniciarRodada();
}

let iniciarRodada = () => {
    iniciarArray();
    randomEscolherJogadorRodada();
    
    document.getElementById("rodadasJogadas").innerHTML = "Rodadas Jogadas: " + ( localStorage.getItem("rodadasJogadas"))

    document.getElementById("vitoriasJogador1").innerHTML = "Vitorias de " + localStorage.getItem("nomeJogador1") + ": "+ ( localStorage.getItem("vitoriasJogador1"))
    document.getElementById("vitoriasJogador2").innerHTML = "Vitorias de " + localStorage.getItem("nomeJogador2") + ": "+ ( localStorage.getItem("vitoriasJogador2"))
    document.getElementById("empates").innerHTML = "Empates: " + localStorage.getItem("empates")
}

let iniciarArray = () => {
    tabuleiro = [];

    for ( i = 0; i < 9; i++ ) {
        tabuleiro.push("");
        document.getElementById(i+1).innerHTML = "";
    }
}

let randomEscolherJogadorRodada = () => {
    let random = Math.floor(Math.random() * 2);
    if ( random == 0) {
        localStorage.setItem("jogadorDaVez", localStorage.getItem("nomeJogador1"));
        localStorage.setItem("simboloDaVez", localStorage.getItem("simboloJogador1"));
    } else {
        localStorage.setItem("jogadorDaVez", localStorage.getItem("nomeJogador2"));
        localStorage.setItem("simboloDaVez", localStorage.getItem("simboloJogador2"));
    }
    document.getElementById("jogadorDaVez").innerHTML = "Vez do Jogador: " + localStorage.getItem("jogadorDaVez")
}

let fazerJogada = (id) => {
    if ( preencherCelula(id) ){

        if ( verificaCampeao() ) {
            document.getElementById("jogadorDaVez").innerHTML = "Partida Acabou";   
            setTimeout(function(){ vitoria(), finalizarPartida(localStorage.getItem("jogadorDaVez")) }, 300);
            
        }else if ( verificaTodosPreenchidos() ) {
            document.getElementById("jogadorDaVez").innerHTML = "Partida Acabou";
            setTimeout(function(){empate(), finalizarPartida("Empate")}, 300);   
            
        }else 
            mudarVezJogadores();
    }
}

let preencherCelula = (id) => {
    if ( tabuleiro[id - 1] != "" ){
        alert("Este campo já esta PREENCHIDO! Jogue Novamente");
        return false;
    }

    tabuleiro[id - 1] = localStorage.getItem("simboloDaVez");
    document.getElementById(id).innerHTML = localStorage.getItem("simboloDaVez");

    if ( localStorage.getItem("jogadorDaVez") == localStorage.getItem("nomeJogador1")  )
        document.getElementById(id).style.color = "red";
    else 
        document.getElementById(id).style.color = "blue";

    return true;
}

let finalizarPartida = (resultadoPartida) => {

    localStorage.setItem("totalPartidas", parseInt(localStorage.getItem("totalPartidas")) + 1);

    let partida = {
        numero: parseInt(localStorage.getItem("totalPartidas")),
        jogador1: localStorage.getItem("nomeJogador1"),
        jogador2: localStorage.getItem("nomeJogador2"),
        resultado: resultadoPartida
    }

    let historico = JSON.parse(localStorage.getItem('historico'));
    historico.push(partida);
    localStorage.setItem("historico", JSON.stringify(historico))

    iniciarRodada();
}

let mudarVezJogadores = () => {
    localStorage.setItem("jogadorDaVez", 
    localStorage.getItem("jogadorDaVez") == localStorage.getItem("nomeJogador1") ? 
    localStorage.getItem("nomeJogador2") : localStorage.getItem("nomeJogador1")); 
    
    localStorage.setItem("simboloDaVez", 
    localStorage.getItem("simboloDaVez") == localStorage.getItem("simboloJogador1") ? 
    localStorage.getItem("simboloJogador2") : localStorage.getItem("simboloJogador1")); 

    document.getElementById("jogadorDaVez").innerHTML = "Vez do Jogador: " + localStorage.getItem("jogadorDaVez");
}   

let verificaTodosPreenchidos = () => {
    let cont = 0;
    for ( i = 0; i < 9; i++ ){
        if ( tabuleiro[i] != "" )
            cont++;
    }

    if ( cont == 9 )
        return true;
    else 
        return false;
}

let vitoria = ( ) => {
    localStorage.setItem("rodadasJogadas", parseInt(localStorage.getItem("rodadasJogadas")) + 1);
    if ( localStorage.getItem("jogadorDaVez") == localStorage.getItem("nomeJogador1") )
        localStorage.setItem("vitoriasJogador1", parseInt(localStorage.getItem("vitoriasJogador1")) + 1)  
    else 
        localStorage.setItem("vitoriasJogador2", parseInt(localStorage.getItem("vitoriasJogador2")) + 1)
    alert(localStorage.getItem("jogadorDaVez") + " Ganhou!!!");
    
}

let empate = () => {
    localStorage.setItem("rodadasJogadas", parseInt(localStorage.getItem("rodadasJogadas")) + 1);
    localStorage.setItem("empates", parseInt(localStorage.getItem("empates")) + 1);
    alert("Deu Empate!!!")
}

let verificaLinhas = () => {
    for ( i = 0; i <= 6; i+= 3){
        if ( tabuleiro[i] != "" && tabuleiro[i] == tabuleiro[i+1] && tabuleiro[i+1] == tabuleiro[i+2] )
            return true;
    }

    return false;
}

let verificaColunas = () => {
    for ( i = 0; i < 3; i++ ){
        if ( tabuleiro[i] != "" && tabuleiro[i] == tabuleiro[i + 3] && tabuleiro[i + 3] == tabuleiro[i + 6] )
            return true;
    }

    return false;
}

let verificaDiagonais = () => {
    if ( tabuleiro[0] != "" && tabuleiro[0] == tabuleiro[4] && tabuleiro[4] == tabuleiro[8] )
        return true;
    else if ( tabuleiro[2] != "" && tabuleiro[2] == tabuleiro[4] && tabuleiro[4] == tabuleiro[6] )
        return true;
    return false;
}

let verificaCampeao = () => {
    let resultado;

    if ( verificaLinhas() != false )
        resultado = true;
    else if ( verificaColunas() != false )
        resultado = true;
    else if ( verificaDiagonais() != false )
        resultado = true;

    return resultado;
}