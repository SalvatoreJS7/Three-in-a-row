import * as PIXI from 'pixi.js';
import { Howl, Howler } from 'howler';
import { app, gameState, sprites } from './game';
import { createField, fieldContainer } from './field';
import { createNewDiamonds, diamondContainer } from './gravity';
import { clearDiamonds, diamondArr, recursionCombination } from './diamonds';
import { movesLevel, target, targetLevel } from './targets';

let menuContainer;
let startGame;
let pauseContainer;
let optionsContainer;
let menuLevelContainer;

export const menu = () => {
    menuContainer = new PIXI.Container();

    const title = new PIXI.Text({
        text: 'Diamonds Crash',
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#002fffff', width: 6 },
            fill: '#41ec0dff'
        }
    })

    title.anchor.set(0.5);
    title.y = - 250;
    menuContainer.addChild(title);

    startGameBtn();
    menuOptions();
    menuLevel();

    const options = new PIXI.Text({
        text: 'Options',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })
    options.anchor.set(0.5);
    options.y = 60;
    options.eventMode = 'static';
    options.cursor = 'pointer';
    options.on('pointerdown', () => {
        menuContainer.visible = false;
        optionsContainer.visible = true;
    })
    options.on('pointerover', () => {
        options.style.fill = '#ffffffff';
    })
    options.on('pointerout', () => {
        options.style.fill = '#06dee6ff';
    })
    menuContainer.addChild(options);

    restartGameBtn();

    menuContainer.x = app.screen.width / 2;
    menuContainer.y = app.screen.height / 2;
    // menuContainer.zIndex = 1
    // menuContainer.visible = false;
    app.stage.addChild(menuContainer);
}

const pauseBtn = () => {
    pauseContainer = new PIXI.Container();
    const pause = new PIXI.Sprite(sprites.pauseSprite);
    pause.width = 100;
    pause.height = 100;
    pause.eventMode = 'static';
    pause.cursor = 'pointer';
    pause.on('pointerdown', () => {
        if(!gameState.isMoving && !gameState.backLightTicker) {
            if(!gameState.pauseActive) {
                gameState.pauseActive = true;
                restartGameBtn();
                startGameBtn();
            }
            
            menuContainer.visible = true;
            fieldContainer.visible = false; 
            pauseContainer.visible = false;
            gameState.move = true;
            diamondArr.forEach((element) => {
                element.visible = false;
            })
        }
        
    })

    pauseContainer.x = app.screen.width - 150;
    pauseContainer.y = 50;
    pauseContainer.addChild(pause);
    app.stage.addChild(pauseContainer);
}

const startGameBtn = () => {
   
    if(!gameState.restartGameActive) {
        startGame = new PIXI.Text({
        text: 'Start Game',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })

    startGame.anchor.set(0.5);
    startGame.eventMode = 'static';
    startGame.cursor = 'pointer';
    startGame.on('pointerover', () => {
        startGame.style.fill = '#ffffffff';
    })
    startGame.on('pointerout', () => {
        startGame.style.fill = '#06dee6ff';
    })
    startGame.on('pointerdown', () => {
        // clearMenu();
        menuContainer.visible = false;
        gameState.restartGameActive = true;
        createField();
        createNewDiamonds();
        pauseBtn();
        target();
        setTimeout(() => recursionCombination(), 2000);
    })
    menuContainer.addChild(startGame);
    }

    else {
        startGame.visible = false;
        const continueGame = new PIXI.Text({
        text: 'Continue Game',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })

    continueGame.anchor.set(0.5);
    continueGame.eventMode = 'static';
    continueGame.cursor = 'pointer';
    continueGame.on('pointerover', () => {
        continueGame.style.fill = '#ffffffff';
    })
    continueGame.on('pointerout', () => {
        continueGame.style.fill = '#06dee6ff';
    })
    continueGame.on('pointerdown', () => {
        // clearMenu();
        menuContainer.visible = false;
        gameState.restartGameActive = true;
        fieldContainer.visible = true;
        pauseContainer.visible = true;
        diamondArr.forEach((element) => {
            element.visible = true;
        })
        gameState.move = false;
        // createField();
        // createNewDiamonds();
        // pauseBtn();
        // setTimeout(() => recursionCombination(), 2000);
    })
    menuContainer.addChild(continueGame);
    }
}

const restartGameBtn = () => {
    if (!gameState.restartGameActive) {
        const restartGame = new PIXI.Text({
        text: 'Restart Game',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#007e83ff',
            fontWeight: 'bold'
        }
        })
        restartGame.anchor.set(0.5);
        restartGame.y = 120;
        menuContainer.addChild(restartGame);
    }

    else {
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
            diamondContainer.destroy({children: true});
            clearDiamonds();
            createNewDiamonds();
            setTimeout(() => recursionCombination(), 1500);
            menuContainer.visible = false;
            pauseContainer.visible = true;
            fieldContainer.visible = true;
            gameState.move = false;
            gameState.targetLevelAmount = 300;
            gameState.movesAmount = 50;
            movesLevel.text = `Moves: ${gameState.movesAmount}`;
            targetLevel.text = `Crash ${gameState.targetLevelAmount} diamonds`;
            console.log('restart');
        })
        restartGame.on('pointerover', () => {
            restartGame.style.fill = '#ffffffff';
        })
        restartGame.on('pointerout', () => {
            restartGame.style.fill = '#06dee6ff';
        })
        menuContainer.addChild(restartGame);
    }
}

const menuOptions = () => {
    optionsContainer = new PIXI.Container();
    optionsContainer.visible = false;
    // let soundMute = false;
    let soundMute = JSON.parse(localStorage.getItem('sound')) || false;
    Howler.mute(soundMute);


    const title = new PIXI.Text({
        text: 'Diamonds Crash',
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#002fffff', width: 6 },
            fill: '#41ec0dff'
        }
    })

    title.anchor.set(0.5);
    title.y = - 250;
    optionsContainer.addChild(title);
    
    const soundOn = new PIXI.Text({
        text: soundMute === false ? 'Sound ON' : 'Sound OFF',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    });

    soundOn.anchor.set(0.5);
    soundOn.eventMode = 'static';
    soundOn.cursor = 'pointer';

    soundOn.on ('pointerdown', () => {
        soundOn.text = soundOn.text === 'Sound ON' ? 'Sound OFF' : 'Sound ON';
        soundMute = soundMute === true ? false : true;
        Howler.mute(soundMute);
        localStorage.setItem('sound', JSON.stringify(soundMute));
    })
    soundOn.on('pointerover', () => {
        soundOn.style.fill = '#ffffffff';
    })
    soundOn.on('pointerout', () => {
        soundOn.style.fill = '#06dee6ff';
    })
    optionsContainer.addChild(soundOn);

    const changeLevel = new PIXI.Text({
        text: 'Level',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })
    changeLevel.anchor.set(0.5);
    changeLevel.y = 60;
    changeLevel.eventMode = 'static';
    changeLevel.cursor = 'pointer';
    changeLevel.on('pointerdown', () => {
        optionsContainer.visible = false;
        menuLevelContainer.visible = true;
    })
    changeLevel.on('pointerover', () => {
        changeLevel.style.fill = '#ffffffff';
    })
    changeLevel.on('pointerout', () => {
        changeLevel.style.fill = '#06dee6ff';
    })
    optionsContainer.addChild(changeLevel);


    const menuBack = new PIXI.Text({
        text: 'Back to menu',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    });

    menuBack.anchor.set(0.5);
    menuBack.y = 140;
    menuBack.eventMode = 'static';
    menuBack.cursor = 'pointer';
    
    menuBack.on('pointerdown', () => {
        optionsContainer.visible = false;
        menuContainer.visible = true;
    });
    menuBack.on('pointerover', () => {
        menuBack.style.fill = '#ffffffff';
    })
    menuBack.on('pointerout', () => {
        menuBack.style.fill = '#06dee6ff';
    })
    optionsContainer.addChild(menuBack);

    optionsContainer.x = app.screen.width / 2;
    optionsContainer.y = app.screen.height / 2;
    app.stage.addChild(optionsContainer);
}

const menuLevel = () => {
    menuLevelContainer = new PIXI.Container();
    menuLevelContainer.visible = false;

    const title = new PIXI.Text({
        text: 'Diamonds Crash',
        style: {
            fontFamily: 'Comic Sans MS',
            fontSize: 104,
            stroke: { color: '#002fffff', width: 6 },
            fill: '#41ec0dff'
        }
    })
    title.anchor.set(0.5);
    title.y = - 250;
    menuLevelContainer.addChild(title);

    const level1 = new PIXI.Text({
        text: 'Level 1',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    })
    level1.anchor.set(0.5);
    level1.eventMode = 'static';
    level1.cursor = 'pointer';
    level1.on('pointerover', () => {
        level1.style.fill = '#ffffffff';
    })
    level1.on('pointerout', () => {
        level1.style.fill = '#06dee6ff';
    })
    menuLevelContainer.addChild(level1);

    const level2 = new PIXI.Text({
        text: 'Level 2',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#007e83ff',
            fontWeight: 'bold'
        }
    });
    level2.anchor.set(0.5);
    level2.y = 60;
    menuLevelContainer.addChild(level2);

    const level3 = new PIXI.Text({
        text: 'Level 3',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#007e83ff',
            fontWeight: 'bold'
        }
    });
    level3.anchor.set(0.5);
    level3.y = 120;
    menuLevelContainer.addChild(level3);

    const menuBack = new PIXI.Text({
        text: 'Back to Options',
        style: {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: '#06dee6ff',
            fontWeight: 'bold'
        }
    });

    menuBack.anchor.set(0.5);
    menuBack.y = 200;
    menuBack.eventMode = 'static';
    menuBack.cursor = 'pointer';
    menuBack.on('pointerdown', () => {
        menuLevelContainer.visible = false;
        optionsContainer.visible = true;
    });
    menuBack.on('pointerover', () => {
        menuBack.style.fill = '#ffffffff';
    })
    menuBack.on('pointerout', () => {
        menuBack.style.fill = '#06dee6ff';
    })
    menuLevelContainer.addChild(menuBack);

    menuLevelContainer.x = app.screen.width / 2;
    menuLevelContainer.y = app.screen.height / 2;
    app.stage.addChild(menuLevelContainer);
}

const clearMenu = () => {
    menuContainer.destroy({children: true});
}