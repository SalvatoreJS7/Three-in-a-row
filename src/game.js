import * as PIXI from 'pixi.js';
import { clearField, createField } from './field';
import { recursionCombination } from './diamonds';
import { createNewDiamonds } from './gravity';
import { assets } from './assets';
import { menu } from './menu';
import { target } from './targets';

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

export const level = [
    'blue','green','green','yellow','blue','yellow',
    'green','blue','purple','yellow','blue','green',
    'purple','purple','green','purple','yellow','purple',
    'green','blue','blue','purple','purple','green',
    'blue','green','green','blue','purple','green',
    'yellow','purple','purple','green','green','blue',
]

export const gameState = {
    move: false,
    activeIndex: null,
    activeDiamond: null,
    isMoving: true,
    restartGameActive: false,
    pauseActive: false,
    backLightTicker: false,
    level: 1,
    targetLevelAmount: 300,
    movesAmount: 50,
}

const createScene = async () => {
    sprites = await assets();
    menu();
    // createField();
    // createDiamonds(level1);
    
}

createScene();

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
