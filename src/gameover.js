import * as PIXI from 'pixi.js';
import { app, gameState, levelStart } from './game';
import { pauseContainer, restartGameBtn } from './menu';
import { clearField, fieldContainer } from './field';
import { diamondContainer } from './gravity';
import { movesLevel, targetContainer, targetLevel } from './targets';
import { clearDiamonds } from './diamonds';
import { gameOverSound } from './sounds';

let gameOverContainer;

export const gameOver = () => {
    // fieldContainer.visible = false;
    gameOverSound.play();
    clearField();
    targetContainer.visible = false;
    // pauseContainer.destroy({children: true});
    pauseContainer.visible = false;
    diamondContainer.destroy({children: true});
    clearDiamonds();

    gameOverContainer = new PIXI.Container();

    const gameOverText = new PIXI.Text({
        text: 'GAME OVER', 
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#ff0000ff', width: 6 },
            fill: '#ffffff'
        }
    })
    gameOverText.y = - 100;
    gameOverText.anchor.set(0.5);
    gameOverContainer.addChild(gameOverText);

    let t = 0;
    app.ticker.add(() => {
        t += 0.05;
        const scale = 1 + Math.sin(t) * 0.05;
        gameOverText.scale.set(scale);
        gameOverText.alpha = 0.7 + Math.sin(t * 2) * 0.3;
    });

    // restartGameBtn();
    const restartGame = new PIXI.Text({
            text: 'Restart Game',
            style: {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: '#06dee6ff',
                fontWeight: 'bold'
            }
            })
            restartGame.anchor.set(0.5);
            restartGame.y = 120;
            restartGame.eventMode = 'static';
            restartGame.cursor = 'pointer';
            restartGame.on('pointerdown', () => {
                gameState.isMoving = true;
                gameState.move = false;
                levelStart();
                movesLevel.text = `Moves: ${gameState.movesAmount}`;
                targetLevel.text = `Crash ${gameState.targetLevelAmount} diamonds`;
                console.log('restart'); 
                gameOverContainer.visible = false;
            })
            restartGame.on('pointerover', () => {
                restartGame.style.fill = '#ffffffff';
            })
            restartGame.on('pointerout', () => {
                restartGame.style.fill = '#06dee6ff';
            })
            gameOverContainer.addChild(restartGame);

    gameOverContainer.x = app.screen.width / 2;
    gameOverContainer.y = app.screen.height / 2;
    app.stage.addChild(gameOverContainer);
    gameState.isMoving = true;
}