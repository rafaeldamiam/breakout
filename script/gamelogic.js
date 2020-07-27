function gameLogic(){
	//gerador de canvas
	var canvas = document.getElementById("canvas");
	//tipo de canvas
	var ctx = canvas.getContext("2d");

	//tamanho da bola
	var b = 8;
	//NAO SEI PRA Q SERVE 
	var x = canvas.width/2.2;
	var y = canvas.height-33;
	//velocidade bola
	var dx = 2.2;
	var dy = -2.2;

	//metricas de velocidade
	var a = 0;
	var multi = 1;

	//pressionar direita
	var presdir = false;
	//pressionar esquerda
	var presesq = false;


	//altura do pad/base
	var altpad = 10;
	//largura do pad/base
	var largpad = 75;
	//velocidade do pad/base
	var paddleX = (canvas.width-largpad)/2.2;

	//largura dos blocos
	var largbloc = 75;
	//altura dos blocos
	var altbloc = 20;
	// tamanho entre blocos
	var padbloc = 5;
	//distancia do grupo de blocos da parede superior do canvas
	var bloctop = 30;
	//distancia do grupo de blocos da parede esquerda do canvas
	var blocesq = 10;
	//contador de blocos verticais
	var contlinbroc = 6;
	//contador de blocos horizontais
	var contcolbroc = 5;
	//armazena os blocos
	var bricks = [];

	//metricas p/ derrota ou vitoria
	var score = 0;
	var lives = 3;

	//posiciona blocos
	for(c=0; c<contcolbroc; c++) {
	    bricks[c] = [];
	    for(r=0; r<contlinbroc; r++) {
	        bricks[c][r] = { x: 0, y: 0, status: 1 };
	    }
	}

	//Captador de movimentos
	document.addEventListener("keydown", tratarteclapres, false);
	document.addEventListener("keyup", tratartecladespre, false);
	document.addEventListener("mousemove", mexemouse, false);

	//pressiona
	function tratarteclapres(e) {
	    if(e.keyCode == 39) {
	        presdir = true;
	    }else if(e.keyCode == 37) {
	        presesq = true;
	    }
	}

	//despressiona
	function tratartecladespre(e) {
	    if(e.keyCode == 39) {
	        presdir = false;
	    }else if(e.keyCode == 37) {
	        presesq = false;
	    }
	}
	function mexemouse(e) {
	    var relativeX = e.clientX - canvas.offsetLeft;
	    if(relativeX > 0 && relativeX < canvas.width) {
	        paddleX = relativeX - largpad/2;
	    }
	}
	//detecta colisões
	function detectacoli() {
	    for(c=0; c<contcolbroc; c++) {
	        for(r=0; r<contlinbroc; r++) {
	            var b = bricks[c][r];
	            if(b.status == 1) {
	                if(x > b.x && x < b.x+largbloc && y > b.y && y < b.y+altbloc) {
	                    dy = -dy;
	                    b.status = 0;
	                    score+=10;
	                    if(score == ((contlinbroc*contcolbroc)*10)) {
	                        vitoria();
	                    }
	                }
	            }
	        }
	    }
	}
	
	//desenha bola
	function desenhaBola() {
	    ctx.beginPath();
	    ctx.arc(x, y, b, 0, Math.PI*2);
	    ctx.fillStyle = "#e50d0d";
	    ctx.fill();
	    ctx.closePath();
	}

	//desenha pad/base
	function desenhapad() {
	    ctx.beginPath();
	    ctx.rect(paddleX, canvas.height-altpad, largpad, altpad);
	    ctx.fillStyle = "#053ec1";
	    ctx.fill();
	    ctx.closePath();
	}

	//desenha blocos
	function desenhabloc() {
	    for(c=0; c<contcolbroc; c++) {
	        for(r=0; r<contlinbroc; r++) {
	            if(bricks[c][r].status == 1) {
	                var brickX = (r*(largbloc+padbloc))+blocesq;
	                var brickY = (c*(altbloc+padbloc))+bloctop;
	                bricks[c][r].x = brickX;
	                bricks[c][r].y = brickY;
	                ctx.beginPath();
	                ctx.rect(brickX, brickY, largbloc, altbloc);
	                ctx.fillStyle = "#053ec1";
	                ctx.fill();
	                ctx.closePath();
	            }
	        }
	    }
	}

	//desenha score
	function desenhascore() {
	    ctx.font = "16px 'Audiowide', cursive";
		ctx.fillStyle = "black";
	    ctx.fillText("Pontuação: "+score, 8, 20);
	}

	//desenha lives
	function desenhalive() {
	    ctx.font = "16px 'Audiowide', cursive";
	    ctx.fillStyle = "black";
	    ctx.fillText("Vidas: "+lives, canvas.width-75, 20);
	}

	//multiplicador de velocidade
	function multiplicador(a){
		if(multi < 1.3){
			multi += 0.1;
		}
		a = (a * multi);
		return a;
	}

	//multiplicador de velocidade
	function speedUp(){
		var x_aux = multiplicador(2);
		var y_aux = multiplicador(30);
		var dx_aux = multiplicador(dx);
		var dy_aux = multiplicador(dy);

		x = canvas.width/x_aux;
		y = canvas.height-y_aux;
		dx = dx_aux;
		dy = -dy_aux;
		paddleX = (canvas.width-largpad)/x_aux;
	}

	//aumenta pad
	function aumentaPad(){
		altpad++;
		largpad += 10;
	}

	//caso vitoria
	function vitoria(){
		alert("Parabéns! Você Venceu!!! \nSeu pontuação foi de: "+score+"\nRestando: "+lives+" vidas");
		document.location.reload();
	}

	//caso derrota
	function derrota(){
		alert("Fim de Jogo!!\nVocê perdeu! \nSeu pontuação foi de: "+score)
	    document.location.reload();
	}

	//limpa e redesenha
	function desenha() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    desenhabloc();
	    desenhaBola();
	    desenhapad();
	    desenhascore();
	    desenhalive();
	    detectacoli();
	    
	    if(x + dx > canvas.width-b || x + dx < b) {
	        dx = -dx;
		}
		
	    if(y + dy < b) {
	        dy = -dy;
	    }else if(y + dy > canvas.height-b) {
			//analisa quedas
	        if(x > paddleX && x < paddleX + largpad) {
	            dy = -dy;
	        }else {
				lives--;
				//game over
	            if(!lives) {
	                derrota();
	            }else {
					speedUp();
					aumentaPad();
	            }
	        }
	    }
		
		//move pad
	    if(presdir && paddleX < canvas.width-largpad) {
	        paddleX += 7;
	    }else if(presesq && paddleX > 0) {
	        paddleX -= 7;
	    }
	    
	    x += dx;
		y += dy;
		
	    requestAnimationFrame(desenha);
	}
	desenha();
}

/* 	PARA CANVAS 1000X600 - ALTERAR CSS WIDTH PARA 40%

	//gerador de canvas
	var canvas = document.getElementById("canvas");
	//tipo de canvas
	var ctx = canvas.getContext("2d");

	//tamanho da bola
	var b = 12;

	//metricas de velocidade
	var a = 0;
	var multiplicador = 1;

	//metricas do canvas
	var x = canvas.width/2.2;
	var y = canvas.height-33;

	//n sei, mas deixou a bola maluca
	var dx = 2.2;
	var dy = -2.2;

	//altura do pad/base
	var altpad = 10;
	//largura do pad/base
	var largpad = 150;


	var paddleX = (canvas.width-largpad)/2.2;

	//pressionar direita
	var presdir = false;
	//pressionar esquerda
	var presesq = false;

	//contador de blocos verticais
	var contlinbroc = 12;
	//contador de blocos horizontais
	var contcolbroc = 10;

	//largura dos blocos
	var largbloc = 75;
	//altura dos blocos
	var altbloc = 20;

	// distancia entre blocos
	var padbloc = 5;
	//distancia do grupo de blocos da parede superior do canvas
	var bloctop = 30;
	//distancia do grupo de blocos da parede esquerda do canvas
	var blocesq = 20;

	var bricks = [];

	//metricas p/ derrota ou vitoria
	var score = 0;
	var lives = 5; */