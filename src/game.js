import * as PIXI from 'pixi.js';
import { clearField, createField } from './field';
import { recursionCombination } from './diamonds';
import { createNewDiamonds } from './gravity';
import { assets } from './assets';
import { menu, pauseBtn, pauseContainer } from './menu';
import { startTimer, target } from './targets';

export const app = new PIXI.Application();
await app.init({
    background: '#000000ff',
    antialias: true,
    width: window.innerWidth,
    height: window.innerHeight,
});
document.body.appendChild(app.canvas);
app.stage.sortableChildren = true;

export let sprites;

export const level = [];

export const gameState = {
    move: false,
    activeIndex: null,
    activeDiamond: null,
    isMoving: true,
    restartGameActive: false,
    pauseActive: false,
    backLightTicker: false,
    level: 1,
    targetLevelAmount: 1,
    movesAmount: 1,
    movesAmountActive: false,
    time: {minutes: 1, seconds: 0},
    timerActive: false,
}

const createScene = async () => {
    sprites = await assets();
    menu();
    pauseBtn();
    // createField();
    // createDiamonds(level1);
}

createScene();

export const levelStart = () => {
    if(gameState.level === 1) {
        gameState.targetLevelAmount = 150;
        gameState.movesAmount = 15;
        gameState.movesAmountActive = true;
        createField();
        createNewDiamonds();
        pauseContainer.visible = true;
        target();
        setTimeout(() => recursionCombination(), 2000);
    }

    if(gameState.level === 2) {
        gameState.movesAmountActive = false;
        gameState.targetLevelAmount = 150;
        gameState.timerActive = true;
        gameState.time.minutes = 1;
        gameState.time.seconds = 0;
        startTimer();
        createField();
        createNewDiamonds();
        pauseContainer.visible = true;
        target();
        setTimeout(() => recursionCombination(), 2000);
    }
}

// await createScene();
// createNewDiamonds();
// setTimeout(() => {
//     recursionCombination();
// }, 2000)

// createScene().then(() => {
//     // createField();
//     // createNewDiamonds();      
//     // setTimeout(() => recursionCombination(), 2000);
// });


const clearScene = () => {
    clearField();
}
