import * as PIXI from 'pixi.js';
import { app, gameState, levelStart } from './game';
import { youWinSound } from './sounds';
import { clearField } from './field';
import { movesLevel, targetContainer, targetLevel } from './targets';
import { pauseContainer } from './menu';
import { diamondContainer } from './gravity';
import { clearDiamonds } from './diamonds';

let youWinContainer;

export const youWin = () => {
    youWinSound.play();
    clearField();
    targetContainer.visible = false;
    pauseContainer.visible = false;
    diamondContainer.destroy({children: true});
    clearDiamonds();

    youWinContainer = new PIXI.Container();

    const youWinText = new PIXI.Text({
        text: 'YOU WIN', 
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#ff0000ff', width: 6 },
            fill: '#ffffff'
        }
    });
    youWinText.anchor.set(0.5);
    youWinText.y = -100;
    youWinContainer.addChild(youWinText);

    let t = 0;
    app.ticker.add(() => {
        t += 0.05;
        const scale = 1 + Math.sin(t) * 0.05;
        youWinText.scale.set(scale);
        youWinText.alpha = 0.7 + Math.sin(t * 2) * 0.3;
    });

    const nextLevel = new PIXI.Text({
        text: 'Next Level',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })
    nextLevel.anchor.set(0.5);
    nextLevel.y = 120;
    nextLevel.eventMode = 'static';
    nextLevel.cursor = 'pointer';
    nextLevel.on('pointerdown', () => {
        gameState.level += 1;
        gameState.isMoving = true;
        gameState.move = false;
        levelStart();
        movesLevel.text = `Moves: ${gameState.movesAmount}`;
        targetLevel.text = `Crash ${gameState.targetLevelAmount} diamonds`;
        youWinContainer.visible = false;
    })
    nextLevel.on('pointerover', () => {
        nextLevel.style.fill = '#ffffffff';
    })
    nextLevel.on('pointerout', () => {
        nextLevel.style.fill = '#06dee6ff';
    })
    youWinContainer.addChild(nextLevel);

    youWinContainer.x = app.screen.width / 2;
    youWinContainer.y = app.screen.height / 2;
    app.stage.addChild(youWinContainer);
}