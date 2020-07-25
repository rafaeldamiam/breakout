function scriptT(){
	//gerador de canvas
	var canvas = document.getElementById("canvas");
	//tipo de canvas
	var ctx = canvas.getContext("2d");

	//tamanho da bola
	var b = 10;

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
	var largpad = 75;


	var paddleX = (canvas.width-largpad)/2.2;

	//pressionar direita
	var presdir = false;
	//pressionar esquerda
	var presesq = false;

	//contador de blocos verticais
	var contlinbroc = 5;
	//contador de blocos horizontais
	var contcolbroc = 4;

	//largura dos blocos
	var largbloc = 75;
	//altura dos blocos
	var altbloc = 20;

	// n sei
	var padbloc = 10;
	//distancia do grupo de blocos da parede superior do canvas
	var bloctop = 30;
	//distancia do grupo de blocos da parede esquerda do canvas
	var blocesq = 30;

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

	function tratarteclapres(e) {
	    if(e.keyCode == 39) {
	        presdir = true;
	    }else if(e.keyCode == 37) {
	        presesq = true;
	    }
	}
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
	                    score++;
	                    if(score == contlinbroc*contcolbroc) {
	                        alert("Parabéns! Você Venceu!!!");
	                        document.location.reload();
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
		
	    ctx.fillText("Score: "+score, 8, 20);
	}

	//desenha lives
	function desenhalive() {
	    ctx.font = "16px 'Audiowide', cursive";
	    ctx.fillStyle = "black";
	    ctx.fillText("Lives: "+lives, canvas.width-75, 20);
	}
	//multiplicador de velocidade
	function speedUp(a){
		if(multiplicador < 1.6){
			multiplicador += 0.2;
		}
		a = a*multiplicador;
		return a;
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
	                alert("Fim de Jogo!!")
	                document.location.reload();
	            }else {
					var x_aux = speedUp(2);
					var y_aux = speedUp(30);
					var dx_aux = speedUp(dx);
					var dy_aux = speedUp(dy);

	                x = canvas.width/x_aux;
	                y = canvas.height-y_aux;
	                dx = dx_aux;
	                dy = -dy_aux;
	                paddleX = (canvas.width-largpad)/x_aux;
	            }
	        }
	    }
		
		//n sei ainda
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