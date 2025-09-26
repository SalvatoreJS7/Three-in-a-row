import * as PIXI from 'pixi.js';
import { app, gameState } from './game';
import { sizeRect, widthField } from './field';

export let targetLevel;
export let movesLevel;
export let targetContainer;
export let timer;
export let timerInterval;

export const target = () => {
    targetContainer = new PIXI.Container();

    targetLevel = new PIXI.Text({
        text: `Crash ${gameState.targetLevelAmount} diamonds`,
        style: {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: '#e22424ff',
            fontWeight: 'bold',
            stroke: { color: '#002fffff', width: 1 },
            
        } 
    })
    targetLevel.anchor.set(0.5);
    targetContainer.addChild(targetLevel);

    movesLevel = new PIXI.Text({
        text: `Moves: ${gameState.movesAmount}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: '#e22424ff',
            fontWeight: 'bold',
            stroke: { color: '#002fffff', width: 1 },
        }
    })
    movesLevel.anchor.set(0.5);
    movesLevel.y = 100;
    targetContainer.addChild(movesLevel);

    timer = new PIXI.Text({
        text: `Time: ${gameState.time.minutes}:${gameState.time.seconds}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: '#e22424ff',
            fontWeight: 'bold',
            stroke: { color: '#002fffff', width: 1 },
        }
    })
    timer.anchor.set(0.5);
    timer.y = 200;
    targetContainer.addChild(timer);

    targetContainer.x = 250;
    targetContainer.y = 200;
    app.stage.addChild(targetContainer);
}

export const targerCheck = (num) => {
    gameState.targetLevelAmount -= num;
    targetLevel.text = `Crash ${gameState.targetLevelAmount} diamonds`;
    if(gameState.targetLevelAmount <= 0) {
        console.log('You win');
    }
}

export const movesAmountChange = () => {
    gameState.movesAmount -= 1;
    movesLevel.text = `Moves: ${gameState.movesAmount}`;
    if(gameState.movesAmount <= 0) {
        console.log('Game Over');
    }
}

// export const timerInterval = () => {
//     if (gameState.time.seconds === 0) {
//         gameState.time.seconds = 60;
//         gameState.time.minutes -= 1;
//         timer.text = `Time: ${gameState.time.minutes}:${gameState.time.seconds}`;
//     }
//     gameState.time.seconds -= 1;
//     timer.text = `Time: ${gameState.time.minutes}:${gameState.time.seconds}`;
// }

export const startTimer = () => {
    timerInterval = setInterval(() => {
        if(gameState.time.minutes === 0 && gameState.time.seconds === 0) {
            console.log('GAME OVER');
            stopTimer();
        }
        if (gameState.time.seconds === 0) {
            gameState.time.seconds = 60;
            gameState.time.minutes -= 1;
            timer.text = `Time: ${gameState.time.minutes}:${gameState.time.seconds}`;
        }
        gameState.time.seconds -= 1;
        timer.text = `Time: ${gameState.time.minutes}:${gameState.time.seconds}`;
    }, 1000);
}

export const stopTimer = () => {
    clearInterval(timerInterval);
}
