var canvas = document.getElementById("canvas") 
var c = canvas.getContext("2d")
initialize();

function initialize() {
	window.addEventListener("resize", resizeCanvas, false);
	resizeCanvas();
}

function redraw() {
	c.strokeStyle = "black";
	c.lineWidth = "1";
	c.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	redraw();
}

canvas.addEventListener("mousemove", movePaddle, false);

function movePaddle(event) {
	user.y = event.clientY - user.height/2;
}

var user = {
	x: 0,
	y: canvas.height/2 - 100/2,
	width: 10,
	height: 100,
	color: "white",
	score: 0
}

var computer = {
	x: canvas.width - 10,
	y: canvas.height/2 - 100/2,
	width: 10,
	height: 100,
	color: "white",
	score: 0
}

var net = {
	x: canvas.width/2 - 1,
	y: 0,
	width: 2,
	height: 10,
	color: "white"

}

var ball = {
	x: canvas.width/2,
	y: canvas.height/2,
	radius: 10,
	speed: 5,
	velocityX: 5,
	velocityY: 5,
	color: "white"
}

function drawRect(x, y, width, height, color) {
	c.fillStyle = color;
	c.fillRect(x, y, width, height);
}
drawRect(0, 0, canvas.width, canvas.height, "black");

function drawCircle(x, y, radius, color) {
	c.fillStyle = color;
	c.beginPath();
	c.arc(x, y, radius, 0, Math.PI*2, false);
	c.closePath();
	c.fill();
}
drawCircle(ball.x, ball.y, ball.radius, ball.color);

function drawText(text, x, y, color) {
	c.fillStyle = color;
	c.font = "75px fantasy";
	c.fillText(text, x, y);
}
drawText(user.score, canvas.width/4, canvas.height/5, "white")
drawText(computer.score, canvas.width/4, canvas.height/5, "white")

function drawNet() {
	for(var i = 0; i <= canvas.height; i += 15) {
		drawRect(net.x, net.y + i, net.width, net.height, net.color);
	}
}

function game() {
	render();
	update();
	gameWon();
}

var framesPerSecond = 50;
setInterval(game, 1000/framesPerSecond);

function render() {
	drawRect(0, 0, canvas.width, canvas.height, "black");
	
	drawNet();
	
	drawText(user.score, canvas.width/4, canvas.height/5, "white");
	drawText(computer.score, 3*canvas.width/4, canvas.height/5, "white");
	
	drawRect(user.x, user.y, user.width, user.height, user.color);
	drawRect(computer.x, computer.y, computer.width, computer.height, 
		computer.color);
	
	drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function update() {
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	var computerLevel = 0.09;
	computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;
	
	if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
		ball.velocityY = -ball.velocityY;
	}
	
	var player = (ball.x < canvas.width/2) ? user : computer;
	
	if(collision(ball, player)) {
		var collidePoint = ball.y - (player.y + player.height/2);
		collidePoint = collidePoint / (player.height/2);
		var angleRad = collidePoint * Math.PI/4;

		var direction = (ball.x < canvas.width/2) ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);

		ball.speed += 0.5;
	}
	if(ball.x - ball.radius < 0) {
		computer.score++;
		resetBall();
	}
	else if(ball.x + ball.radius > canvas.width) {
		user.score++;
		resetBall();
	}
}

function resetBall() {
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;

	ball.speed = 5;
	ball.velocityX = -ball.velocityX;
}

function collision(ball, player) {
	player.top = player.y;
	player.bottom = player.y + player.height;
	player.left = player.x;
	player.right = player.x + player.width;

	ball.top = ball.y - ball.radius;
	ball.bottom = ball.y + ball.radius;
	ball.left = ball.x - ball.radius;
	ball.right = ball.x + ball.radius;

	return ball.right > player.left && ball.top < player.bottom &&
	ball.left < player.right && ball.bottom > player.top;

}

function gameWon() {

}