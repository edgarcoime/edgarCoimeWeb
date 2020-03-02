const STARTGAME = document.querySelector('#start');
const SCORE = document.querySelector('#score');
const SPAWNTHRESHOLD = spawnThreshold = document.querySelector("#spawnArea");
const TIMERTEXT = document.querySelector("#timerText");

let spawnRate = 500;
let secondRate = 1000;
let bloodTimeOut = 30_000;

let scoreCounter = 0;
let gameTimer = 100;

const zergDeathSound = document.getElementById("zerg-death-audio");
const bgMusic = document.getElementById("in-game-bg-audio");
const menuMusic = document.getElementById("main-theme-audio");
const zergWin = document.getElementById("zerg-victory-audio");

// calculates timer and countdown
function countdown(count) {
    window.gameTime = setInterval(function() {
        count -= 1;
        TIMERTEXT.textContent = count;
        if (300 < spawnRate) {
            spawnRate -= 100
        }
        console.log(spawnRate);
        if (count === 0) {
            document.querySelector("#spawnArea").innerHTML = `
            <h1 class='game-win'>YOU WIN! You protected the Nexus</h1>\n
            <h2>You protected the nexus!</h2>\n
            <button class="button retry-button" onClick="window.location.reload();">Retry</button>`;
            clearInterval(window.spawnGame);
            clearInterval(window.gameTime);
        }
    }, secondRate)
}

// produces a random y-axis to spawn zergling
function randomYAxis() {
    yAxis = Math.floor(Math.random() * 600);
    // console.log(yAxis);
    return yAxis;
}

function stopMovement(intervalVariable) {
    clearInterval(intervalVariable)
}

function death(zergling, intervalVariable) {
    return function () {
        // calls function to stop element moving
        clearInterval(intervalVariable);

        // increments score counter and updates html
        scoreCounter += 1;
        SCORE.textContent = "Score: " + scoreCounter;

        // plays sound to indicate death cloning audio source to allow overlap
        cloneDeathSound = zergDeathSound.cloneNode();
        cloneDeathSound.play();

        // replaces image with death.gif and deactivates pointer
        zergling.src = "images/death.gif";
        zergling.className = "death";
        zergling.style.pointerEvents = 'none';

        // 800ms to change  death gif to static blood photo
        setTimeout(function() {
            zergling.src = "images/blood.gif";
        }, 800);

        //20sec after death element is deleted
        let clearBody = setTimeout(function() {
            SPAWNTHRESHOLD.removeChild(zergling)
        }, bloodTimeOut);
    }
}

function zergling(counter) {
    window.spawnGame = setInterval(function() {
        // creating zergling element and declaring its class
        let zergling = document.createElement("img");
        zergling.src = 'images/zergling.gif';
        zergling.className = "zergling";
        zergling.classList.add("zergling" + counter);

        // applying zergling pseudo-random y-axis and appending to spawn area div
        yAxis = randomYAxis();
        SPAWNTHRESHOLD.appendChild(zergling);
        zergling.style.position = "absolute";
        zergling.style.top = yAxis + "px";

        // setting incremental movement to the right and making game over condition
        let left = 0;
        let horizontal = setInterval(function() {
            zergling.style.left = left + "px";
            left += 2;

            // NOTE: Maybe for game-overs make a div and populate but make it invisible
            //       Then when game-over conditions are met clear container div and show game over div instead. 
            // when zerglings pass certain threshold game is over and user has lost
            if (parseInt(zergling.style.left) > (screen.width * .75)) {
                document.querySelector("#spawnArea").innerHTML = `
                <h1 class='game-over'>GAME OVER</h1>\n
                <h2>You allowed the Zerg swarm to surround and kill you</h2>\n
                <button class="button retry-button" onClick="window.location.reload();">Retry</button>`;
                clearInterval(window.spawnGame);
                clearInterval(window.gameTime);
                clearInterval(horizontal);
                bgMusic.pause();
                zergWin.play();
            }
        }, 12);

        zergling.addEventListener('click', death(zergling, horizontal));
        counter += 1;
    }, spawnRate)
}

// user interaction screens 
function victoryScreen() {
    console.log('none')
}
function defeatScreen() {
    console.log('none')
}
function quitGamePage() {
    // quit game refreshes the page after a certain amount of time so 
    // that we can display goodbye message to user
    console.log('none')
}
function refreshPage() {
    console.log('none')
}


function startGame() {
    // removing start menu and initializing game
    menuMusic.pause();
    menuMusic.currentTime = 0;
    bgMusic.play();
    // document.getElementById("mainContainer").style.background = "url('images/creep.jpg')";

    // clears 
    let bodyParent = document.querySelector("#mainContainer");
    let child = document.querySelector("#start");
    bodyParent.removeChild(child);

    let nexus = document.createElement("img");
    nexus.src = 'images/nexus.png';
    nexus.className = "nexus";
    SPAWNTHRESHOLD.appendChild(nexus);


    // initializing game time
    countdown(gameTimer);

    let spawnCount = 0;
    zergling(spawnCount);
}
STARTGAME.onclick = startGame;
menuMusic.play();




// function moveHorizontal(counter) {
//     let zerglingInstance = document.getElementsByClassName("zergling");
//     let left = 0;
//     // console.log(zerglingInstance[counter]);

//     setInterval(function() {
//         zerglingInstance[counter].style.left = left + "px";
//         left += 3;
//         // console.log(parseInt(zerglingInstance[counter].style.left))
//         // console.log(screen.width)

//         // How to make a guard condition where its game over if you pass a point in the screen?
//         if (parseInt(zerglingInstance[counter].style.left) > (screen.width * .80)) {
//             document.querySelector("#spawnArea").innerHTML = "<h1 class='game-over'>GAME OVER</h1>";
//         }
//     }, 40)
    
//     // setInterval(() => {
//     //     zerglingInstance[counter].style.left = left + "px";
//     //     left += 20;
//     // }, 400); 
// }

// function zergling(counter) {
//     let spawnThreshold = document.querySelector("#spawnArea");

//     setInterval(function() {
//         let zergling = document.createElement("img");
//         zergling.src = 'images/zergling.gif';
//         zergling.className = "zergling";
//         zergling.classList.add("zergling" + counter);

//         yAxis = randomYAxis();
//         spawnThreshold.appendChild(zergling);
//         zergling.style.position = "absolute";
//         zergling.style.top = yAxis + "px";

//         zergling.addEventListener('click', death(zergling, counter));

        
//         moveHorizontal(counter);
//         counter += 1;
//     }, 1200)
// }

// function death(zergling, counter) {
//     return function () {
//         // document.querySelector("#zergling" + counter).src = "images/death.gif";
//         zergling.src = "images/death.gif";
//     }
// }

// // Initializes helper functions and drives game
// function startGame() {
//     // removing start menu and initializing game
//     let bodyParent = document.querySelector("#mainContainer");
//     let child = document.querySelector("#start");
//     bodyParent.removeChild(child);

//     // initializing game time
//     let count = 100;
//     countdown(count);

//     let spawnCount = 0;
//     zergling(spawnCount);

// }
// STARTGAME.onclick = startGame;




// function zergling(counter) {
//     console.log(counter);
//     let spawnThreshold = document.querySelector("#spawnArea");

//     let zergling = document.createElement("img");
//     zergling.src = 'images/zergling.gif';
//     zergling.className = "zergling";
//     zergling.classList.add("z" + counter);
//     counter += 1;

//     yAxis = randomYAxis();
//     spawnThreshold.appendChild(zergling);
//     zergling.style.position = "absolute";
//     zergling.style.top = yAxis + "px";
// }




// console.log(randomYAxis());

// // countdown nested function
// let countdown = 100;
// let timerText = document.querySelector("#timerText")
// setInterval(function() {
//     countdown -= 1;
//     console.log(countdown);
//     timerText.textContent = countdown;
// }, 1000)