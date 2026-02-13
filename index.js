
const startBtn = document.getElementById('start-game-btn');
const instructionsUI = document.getElementById('instructions-ui');

startBtn.addEventListener('click', () => {
    // Fade out the instructions
    instructionsUI.style.opacity = '0';
    
    // Remove from DOM after fade
    setTimeout(() => {
        instructionsUI.style.display = 'none';
    }, 500);
    
    // Optional: Start your game music here if you have any!
});

const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const collisionsMap = []
for(let i = 0; i < collisions.length; i+=80){
    collisionsMap.push(collisions.slice(i, i+80) )
}
const chestMap = []
for(let i = 0; i < chests.length; i+=80){
    chestMap.push(chests.slice(i, i+80) )
}


class Boundry{
    static pixel = 64;
    constructor({position}){
        this.position = position
        this.width = 64
        this.height = 64
    }

    draw(){
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundries = []
const offset = {
    x: -2400,
    y:-1180
}
collisionsMap.forEach((row, i) => 
    row.forEach((symbol, j) => {
        if(symbol === 340){
            boundries.push(
                new Boundry({
                    position: {
                        x: j * Boundry.pixel + offset.x,
                        y: i * Boundry.pixel + offset.y
                    }
                })
            )
        }
    })
)
const chestsPlace = []
chestMap.forEach((row, i) => 
    row.forEach((symbol, j) => {
        if(symbol === 340){
            chestsPlace.push(
                new Boundry({
                    position: {
                        x: j * Boundry.pixel + offset.x,
                        y: i * Boundry.pixel + offset.y
                    }
                })
            )
        }
    })
)

const img = new Image()
img.src = './img/map.png'

const charDown = new Image()
charDown.src = './img/playerDown.png'

const charUp = new Image()
charUp.src = './img/playerUp.png'

const charLeft = new Image()
charLeft.src = './img/playerLeft.png'

const charRight = new Image()
charRight.src = './img/playerRight.png'

const foreImg = new Image();
foreImg.src = './img/foreground.png'

class Sprite {
    constructor({position, image, frame = {max: 1}, sprite}){
        this.position = position
        this.image = image
        this.frame = {...frame, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width/this.frame.max
            this.height = this.image.height
        }
        this.moving = false;
        this.sprite = sprite;
    }
    draw(){
        c.drawImage(
            this.image, 
            this.frame.val * this.width, 
            0,
            this.image.width/this.frame.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frame.max,
            this.image.height
        )

        if(!this.moving) return;
        if(this.frame.max > 1){
            this.frame.elapsed++;
        }

        if(this.frame.elapsed%10 === 0){
            if(this.frame.val < this.frame.max -1) this.frame.val++;
            else this.frame.val = 0;
        }
            
    }
}

const player = new Sprite ({
    position: {
        x: canvas.width/2 - 192/8,
        y: canvas.height/2 - 68/2
    },
    image: charUp,
    frame: {
        max: 4
    },
    sprite: {
        up:charUp,
        down:charDown,
        left:charLeft,
        right:charRight
    }
})


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: img
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foreImg
})

const keys = {
    w: {
        pressed: false
    },a: {
        pressed: false
    },s: {
        pressed: false
    },d: {
        pressed: false
    }
}

const moveables = [background, ...boundries, foreground, ...chestsPlace];
function rectCollision ({rect1, rect2}) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
    )

}
let lastKey = '';
function animeLoop(){
    window.requestAnimationFrame(animeLoop)
    background.draw()
    boundries.forEach(bound => {
        bound.draw()
    })
    chestsPlace.forEach(chest => {
        chest.draw()
    })
    
    player.draw();
    foreground.draw()   

    if(keys.w.pressed || keys.a.pressed  || keys.s.pressed  || keys.d.pressed ){
        for(let i = 0; i < chestsPlace.length; i++){
        const chest = chestsPlace[i]
        if(rectCollision({ rect1: player, rect2: chest })){
            console.log('opening chest');
            valentineUI.classList.remove('hidden'); // This will show the pop-up!
            break;
        }}
    }

    player.moving = false
    if(keys.w.pressed && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprite.up
        let moving = true;
        for(let i = 0; i < boundries.length; i++){
            const bound = boundries[i]
            if(rectCollision({
            rect1:player,
            rect2: {
                ...bound,
                position: {
                    x: bound.position.x,
                    y: bound.position.y + 3
                }
            } })){
                moving = false;
                break;
        } 
        }
        if(moving)
            moveables.forEach(moveable => {
                console.log('colliding')
                moveable.position.y += 3;
            })
    }
    else if(keys.a.pressed  && lastKey === 'a') {
        player.moving = true;
        player.image = player.sprite.left
        let moving = true;
        for(let i = 0; i < boundries.length; i++){
            const bound = boundries[i]
            if(rectCollision({
            rect1:player,
            rect2: {
                ...bound,
                position: {
                    x: bound.position.x + 3,
                    y: bound.position.y
                }
            } })){
                moving = false;
                console.log('colliding')
                break;
        } 
        }
        if(moving)
            moveables.forEach(moveable => {
                moveable.position.x += 3;
            })
    }
    else if(keys.s.pressed  && lastKey === 's') {
        player.moving = true;
        player.image = player.sprite.down
        let moving = true;
        for(let i = 0; i < boundries.length; i++){
            const bound = boundries[i]
            if(rectCollision({
            rect1:player,
            rect2: {
                ...bound,
                position: {
                    x: bound.position.x,
                    y: bound.position.y - 3
                }
            } })){
                moving = false;
                console.log('colliding')
                break;
        } 
        }
        if(moving)
            moveables.forEach(moveable => {
                moveable.position.y -= 3;
            })
    }
    else if(keys.d.pressed  && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprite.right
        let moving = true;
        for(let i = 0; i < boundries.length; i++){
            const bound = boundries[i]
            if(rectCollision({
            rect1:player,
            rect2: {
                ...bound,
                position: {
                    x: bound.position.x - 3,
                    y: bound.position.y
                }
            } })){
                moving = false;
                console.log('colliding')
                break;
        } 
        }
        if(moving)
            moveables.forEach(moveable => {
                moveable.position.x -= 3;
            })
    }

}
animeLoop();

window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w'
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's'
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break;        
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;        
    }
})

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})


const valentineUI = document.getElementById('valentine-ui');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

let noClicks = 0;
let yesScale = 1;
let noScale = 1;

noBtn.addEventListener('click', () => {
    noClicks++;
    
    // Make Yes bigger, No smaller
    yesScale += 0.4;
    noScale -= 0.15;
    
    yesBtn.style.transform = `scale(${yesScale})`;
    noBtn.style.transform = `scale(${noScale})`;
    
    // Change text for extra cuteness/persuasion
    const pleas = ["Are you sure?", "Pleease?", "Really??", "Think again!", "Last chance!"];
    if (noClicks <= pleas.length) {
        noBtn.innerText = pleas[noClicks - 1];
    }

    if (noClicks >= 5) {
        noBtn.style.display = 'none'; // Bye bye No button!
    }
});


const questionCard = document.getElementById('question-card');
const successCard = document.getElementById('success-card');
const closeBtn = document.getElementById('close-btn');

// Replace your old yesBtn listener with this:
yesBtn.addEventListener('click', () => {
    // Hide the question, show the success!
    questionCard.classList.add('hidden');
    successCard.classList.remove('hidden');
    
    // Optional: Log it so you know she said yes!
    console.log("Mission Accomplished! ❤️");
});

// Close everything to go back to the game
closeBtn.addEventListener('click', () => {
    valentineUI.classList.add('hidden');
    // Reset the cards for next time if needed
    questionCard.classList.remove('hidden');
    successCard.classList.add('hidden');
});

