import './style.css'

const canvas = document.getElementById('pong-canvas')
const ctx = canvas.getContext('2d')

const BLOCK_SIZE = 10
const BOARD_WIDTH = 20
const BOARD_HEIGHT = 20

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

// Board array 100x100

const board = []

for (let i = 0; i < BOARD_HEIGHT; i++) {
  board[i] = []
  for (let j = 0; j < BOARD_WIDTH; j++) {
    if (j < BOARD_WIDTH / 2) board[i][j] = 0
    if (j > BOARD_WIDTH / 2) board[i][j] = 1
  }
}

// Balls
const position1 = {
  x: Math.floor(Math.random() * BOARD_WIDTH / 2) + BOARD_WIDTH / 2,
  y: Math.floor(Math.random() * BOARD_HEIGHT)
}
const position0 = {
  x: Math.floor(Math.random() * BOARD_WIDTH / 2),
  y: Math.floor(Math.random() * BOARD_HEIGHT)
}
console.log(position1)

const balls = [
  {
    id: 0,
    position: position0,
    direction: { x: 1, y: 1 },
    shape: [
      [0, 0],
      [0, 0]
    ]
  },
  {
    id: 1,
    position: position1,
    direction: { x: -1, y: -1 },
    shape: [
      [1, 1],
      [1, 1]
    ]
  }
]

// Game loop
let dropCounter = 0
let lastTime = 0
function update (time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 60) {
    if (balls[1].direction.y === 1) {
      balls[1].position.y++
      if (checkCollision(balls[1])) {
        paintPixel(balls[1])
        balls[1].position.y--
        balls[1].direction.y = -1
      }
    } else {
      balls[1].position.y--
      if (checkCollision(balls[1])) {
        paintPixel(balls[1])
        balls[1].position.y++
        balls[1].direction.y = 1
      }
    }
    if (balls[1].direction.x === 1) {
      balls[1].position.x++
      if (checkCollision(balls[1])) {
        paintPixel(balls[1])
        balls[1].position.x--
        balls[1].direction.x = -1
      }
    } else {
      balls[1].position.x--
      if (checkCollision(balls[1])) {
        paintPixel(balls[1])
        balls[1].position.x++
        balls[1].direction.x = 1
      }
    }
    dropCounter = 0
  }
  draw()
  window.requestAnimationFrame(update)
}

function paintPixel (ball) {
  if (
    board[ball.position.y] &&
    board[ball.position.y + 1] &&
    board[ball.position.y - 1] &&
    board[ball.position.y + 2]
  ) {
    if (ball.direction.y === 1 && ball.direction.x === 1) {
      board[ball.position.y + 1][ball.position.x] = 1
      board[ball.position.y][ball.position.x + 1] = 1
      board[ball.position.y][ball.position.x] = 1
      board[ball.position.y + 1][ball.position.x + 1] = 1
    } else if (ball.direction.y === -1 && ball.direction.x === -1) {
      board[ball.position.y + 1][ball.position.x] = 1
      board[ball.position.y][ball.position.x - 1] = 1
      board[ball.position.y][ball.position.x] = 1
      board[ball.position.y + 1][ball.position.x - 1] = 1
    } else if (ball.direction.y === 1 && ball.direction.x === -1) {
      board[ball.position.y][ball.position.x] = 1
      board[ball.position.y + 1][ball.position.x - 1] = 1
      board[ball.position.y + 1][ball.position.x] = 1
      board[ball.position.y][ball.position.x - 1] = 1
    } else if (ball.direction.y === -1 && ball.direction.x === 1) {
      board[ball.position.y - 1][ball.position.x] = 1
      board[ball.position.y][ball.position.x + 1] = 1
      board[ball.position.y][ball.position.x] = 1
      board[ball.position.y - 1][ball.position.x + 1] = 1
    }
  }
}

function draw () {
  ctx.fillStyle = '#ebebeb'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      if (board[i][j] === 1) {
        ctx.fillStyle = '#cad2c5'
        ctx.fillRect(j, i, 1, 1)
      } else if (board[i][j] === 0) {
        ctx.fillStyle = '#ebebeb'
        ctx.fillRect(j, i, 1, 1)
      }
    }
  }

  // draw balls
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i]
    const ballShape = ball.shape
    const ballPosition = ball.position

    for (let y = 0; y < ballShape.length; y++) {
      for (let x = 0; x < ballShape[y].length; x++) {
        if (ballShape[y][x] === 1) {
          ctx.fillStyle = '#ebebeb'
          ctx.fillRect(ballPosition.x + x, ballPosition.y + y, 1, 1)
        } else if (ballShape[y][x] === 0) {
          ctx.fillStyle = '#cad2c5'
          ctx.fillRect(ballPosition.x + x, ballPosition.y + y, 1, 1)
        }
      }
    }
  }
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp') {
    balls[0].position.y--
    if (checkCollision(balls[0])) {
      balls[0].position.y++
    }
  }
  if (event.key === 'ArrowDown') {
    balls[0].position.y++
    if (checkCollision(balls[0])) {
      balls[0].position.y--
    }
  }
  if (event.key === 'ArrowLeft') {
    balls[0].position.x--
    if (checkCollision(balls[0])) {
      balls[0].position.x++
    }
  }
  if (event.key === 'ArrowRight') {
    balls[0].position.x++
    if (checkCollision(balls[0])) {
      balls[0].position.x--
    }
  }
})

function checkCollision (ball) {
  if (ball.id === 0) {
    return ball.shape.find((row, y) => {
      return row.find((value, x) => {
        return (
          value !== 0 &&
          board[ball.position.y + y]?.[ball.position.x + x] !== 0
        )
      })
    })
  } else if (ball.id === 1) {
    return ball.shape.find((row, y) => {
      return row.find((value, x) => {
        return (
          value !== 0 &&
          board[ball.position.y + y]?.[ball.position.x + x] !== 1
        )
      })
    })
  }
}

update()
