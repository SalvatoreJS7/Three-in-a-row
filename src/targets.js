import * as PIXI from 'pixi.js';
import { app, gameState } from './game';
import { sizeRect, widthField } from './field';

export let targetLevel;
export let movesLevel;

export const target = () => {
    const targetContainer = new PIXI.Container();

    targetLevel = new PIXI.Text({
        text: `Crash ${gameState.targetLevelAmount} diamonds`,
        style: {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: '#ffffffff',
            fontWeight: 'bold'
        } 
    })
    targetLevel.anchor.set(0.5);
    targetContainer.addChild(targetLevel);

    movesLevel = new PIXI.Text({
        text: `Moves: ${gameState.movesAmount}`,
        style: {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: '#ffffffff',
            fontWeight: 'bold'
        }
    })
    movesLevel.anchor.set(0.5);
    movesLevel.y = 100;
    targetContainer.addChild(movesLevel);

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