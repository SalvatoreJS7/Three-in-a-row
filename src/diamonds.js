import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import { app, gameState, level, sprites } from './game';
import { fieldSize, heightField, sizeRect, widthField } from './field';
import { createNewDiamonds, diamondContainer, diamondsGravity } from './gravity';
import { bonusBombSound, diamondExplosionSound, diamondSwitch, diamondSwitchBack } from './sounds';
import { bombBonus, bonusRow } from './bonuses';
import { movesAmountChange, targerCheck, targetLevel } from './targets';

let backlightTicker;
let direction;
export const diamondArr = [];
let toRemove = [];

export const createRandomDiamond = () => {
    // const greenDiamondSprite = await PIXI.Assets.load('assets/sprites/green_diamond.png');
    // const blueDiamondSprite = await PIXI.Assets.load('assets/sprites/blue_diamond.png');
    // const purpleDiamondSprite = await PIXI.Assets.load('assets/sprites/purple_diamond.png');
    // const yellowDiamondSprite = await PIXI.Assets.load('assets/sprites/yellow_diamond4.1.png');
    // const bombDiamondSprite = await PIXI.Assets.load('assets/sprites/bonus_bomb_diamond.png');

    if(Math.random() < 0.03) {
        const bombDiamond = new PIXI.Sprite(sprites.bombDiamondSprite);
        bombDiamond.width = sizeRect;
        bombDiamond.height = sizeRect;
        bombDiamond.eventMode = 'static';
        bombDiamond.cursor = 'pointer';
        bombDiamond.color = 'bomb';
        bombDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0xffffff,
        })];

        bombDiamond.on('pointerdown', () => {
            if(!gameState.isMoving) {
                eventOn(bombDiamond);
            }    
        });
       
        return bombDiamond;
    }

    if(Math.random() < 0.06 && Math.random() >= 0.03) {
        const rowDiamond = new PIXI.Sprite(sprites.bonusRowSprite);
        rowDiamond.width = sizeRect;
        rowDiamond.height = sizeRect;
        rowDiamond.eventMode = 'static';
        rowDiamond.cursor = 'pointer';
        rowDiamond.color = 'row';
        rowDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0xffffff,
        })];

        rowDiamond.on('pointerdown', () => {
            if(!gameState.isMoving) {
                eventOn(rowDiamond);
            }    
        });
       
        return rowDiamond;
    }
    
    const randomDiamondArr = ['green', 'yellow', 'blue', 'purple'];
    const randomDiamondIndex = Math.floor(Math.random() * randomDiamondArr.length);
    
    if (randomDiamondArr[randomDiamondIndex] === 'green') {
        const greenDiamond = new PIXI.Sprite(sprites.greenDiamondSprite);
        greenDiamond.width = sizeRect;
        greenDiamond.height = sizeRect;
        greenDiamond.eventMode = 'static';
        greenDiamond.cursor = 'pointer';
        greenDiamond.color = 'green';
        greenDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0x00ff00,
        })];

        greenDiamond.on('pointerdown', () => {
            if(!gameState.isMoving) {
                eventOn(greenDiamond);
            }    
        });
        // diamondContainer.addChild(greenDiamond);
        return greenDiamond;
    }

    if (randomDiamondArr[randomDiamondIndex] === 'blue') {
        const blueDiamond = new PIXI.Sprite(sprites.blueDiamondSprite);
        blueDiamond.width = sizeRect;
        blueDiamond.height = sizeRect;
        blueDiamond.eventMode = 'static';
        blueDiamond.cursor = 'pointer';
        blueDiamond.color = 'blue';
        blueDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0x00ffff,
        })];

        blueDiamond.on('pointerdown', () => {

            if(!gameState.isMoving) {
                eventOn(blueDiamond);
            }
        });
        // diamondContainer.addChild(blueDiamond);
        return blueDiamond;
    }

    if (randomDiamondArr[randomDiamondIndex] === 'purple') {
        const purpleDiamond = new PIXI.Sprite(sprites.purpleDiamondSprite);
        purpleDiamond.width = sizeRect;
        purpleDiamond.height = sizeRect;
        purpleDiamond.eventMode = 'static';
        purpleDiamond.cursor = 'pointer';
        purpleDiamond.color = 'purple';
        purpleDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0xEE82EE,
        })];

        purpleDiamond.on('pointerdown', () => {

            if(!gameState.isMoving) {
                eventOn(purpleDiamond);
            }
        });
        
        // diamondContainer.addChild(purpleDiamond);
        return purpleDiamond;
    }

    if (randomDiamondArr[randomDiamondIndex] === 'yellow') {
        const yellowDiamond = new PIXI.Sprite(sprites.yellowDiamondSprite);
        yellowDiamond.width = sizeRect;
        yellowDiamond.height = sizeRect;
        yellowDiamond.eventMode = 'static';
        yellowDiamond.cursor = 'pointer';
        yellowDiamond.color = 'yellow';
        yellowDiamond.filters = [new GlowFilter({
            distance: 20,
            outerStrength: 0,
            innerStrength: 0,
            color: 0xFFD700,
        })];

        yellowDiamond.on('pointerdown', () => {

            if(!gameState.isMoving) {
                eventOn(yellowDiamond);
            }
        });

        // diamondContainer.addChild(yellowDiamond);
        return yellowDiamond;
    }

    
    
}

const checkNearIndex = (index) => {
    if(index === gameState.activeIndex + 1) {
        direction = 'right';
        return true;
    }
    if(index === gameState.activeIndex - 1) {
        direction = 'left';
        return true;
    }
    if(index === gameState.activeIndex + widthField) {
        direction = 'down';
        return true;
    }
    if(index === gameState.activeIndex - widthField) {
        direction = 'up';
        return true;
    }
    
    return false;
}

const eventOn = (diamond) => {

    let value = 0;
    let stepValue = 1;

    if (!gameState.move) {
        gameState.move = true;
        gameState.activeIndex = diamond.index;
        gameState.activeDiamond = diamond;  
        diamondTickerOn(diamond);
    }

    if(gameState.move) {
        if (checkNearIndex(diamond.index)) {

            if(direction === 'left') {
                diamondTickerOff(gameState.activeDiamond);
                const startPostionActiveDiamond = gameState.activeDiamond.x;
                const startPositionDiamond = diamond.x;
                const finalPositionActiveDiamond = gameState.activeDiamond.x - 100;
                const finalPositionDiamond = diamond.x + 100;
                diamondSwitch.play();
                const diamondMoveTicker = () => {
                    gameState.isMoving = true;
                    diamond.x += stepValue;
                    gameState.activeDiamond.x -= stepValue;
                    stepValue += 0.4;
                    value += stepValue;
                    
                    if(value >= sizeRect) {
                        value = 0;
                        stepValue = 1;
                        app.ticker.remove(diamondMoveTicker);

                        gameState.activeDiamond.x = finalPositionActiveDiamond;
                        diamond.x = finalPositionDiamond;

                        level[gameState.activeDiamond.index] = diamond.color;
                        level[diamond.index] = gameState.activeDiamond.color;

                        if(gameState.activeDiamond.color === 'bomb') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(gameState.activeDiamond.color === 'row') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'bomb') {
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'row') {
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(checkCombination()) {
                            

                            diamondArr[diamond.index] = gameState.activeDiamond; 
                            gameState.activeDiamond.index = diamond.index; 
                            diamond.index = gameState.activeIndex;
                            gameState.activeIndex = null;
                            diamondArr[diamond.index] = diamond;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            // isMoving = false;
                            diamondExplosionSound.play();
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                // diamondArr[element].destroy({children: true});
                                diamondArr[element] = '';
                            })
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                           
                            
                        }

                        else{
                            level[gameState.activeDiamond.index] = gameState.activeDiamond.color;
                            level[diamond.index] = diamond.color;
                            console.log(level)
                            diamondSwitchBack.play();
                            movesAmountChange();
                            const diamondMoveBackTicker = () => {
                               
                                diamond.x -= stepValue;
                                gameState.activeDiamond.x += stepValue;
                                stepValue += 0.4;
                                value += stepValue;

                                if(value >= sizeRect) {
                                    value = 0;
                                    stepValue = 1;
                                    app.ticker.remove(diamondMoveBackTicker);

                                    gameState.activeDiamond.x = startPostionActiveDiamond;
                                    diamond.x = startPositionDiamond;

                                    // level1[gameState.activeDiamond.index] = 
                                    gameState.activeIndex = null;
                                    gameState.activeDiamond = null;
                                    gameState.move = false;
                                    gameState.isMoving = false;
                                }
                            }
                            app.ticker.add(diamondMoveBackTicker); 
                            
                        }
                    }
                }
                app.ticker.add(diamondMoveTicker)              
            }
            if(direction === 'right') {
                diamondTickerOff(gameState.activeDiamond);
                const startPostionActiveDiamond = gameState.activeDiamond.x;
                const startPositionDiamond = diamond.x;
                const finalPositionActiveDiamond = gameState.activeDiamond.x + 100;
                const finalPositionDiamond = diamond.x - 100;
                diamondSwitch.play();
                const diamondMoveTicker = () => {
                    gameState.isMoving = true;
                    diamond.x -= stepValue;
                    gameState.activeDiamond.x += stepValue;
                    stepValue += 0.4;
                    value += stepValue;
                    if(value >= sizeRect) {
                        value = 0;
                        stepValue = 1;
                        app.ticker.remove(diamondMoveTicker);
                        gameState.activeDiamond.x = finalPositionActiveDiamond;
                        diamond.x = finalPositionDiamond;
                        level[gameState.activeDiamond.index] = diamond.color;
                        level[diamond.index] = gameState.activeDiamond.color;
                        if(gameState.activeDiamond.color === 'bomb') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(gameState.activeDiamond.color === 'row') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'bomb') {
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'row') {
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(checkCombination()) {
                            diamondArr[diamond.index] = gameState.activeDiamond; 
                            gameState.activeDiamond.index = diamond.index; 
                            diamond.index = gameState.activeIndex;
                            gameState.activeIndex = null;
                            diamondArr[diamond.index] = diamond;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            // gameState.isMoving = false;
                            diamondExplosionSound.play();
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            })
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                        }

                        else{
                            level[gameState.activeDiamond.index] = gameState.activeDiamond.color;
                            level[diamond.index] = diamond.color;
                            console.log(level)
                            diamondSwitchBack.play();
                            movesAmountChange();
                            const diamondMoveBackTicker = () => {
                                diamond.x += stepValue;
                                gameState.activeDiamond.x -= stepValue;
                                stepValue += 0.4;
                                value += stepValue;
                                if(value >= sizeRect) {
                                    value = 0;
                                    stepValue = 1;
                                    app.ticker.remove(diamondMoveBackTicker);
                                    gameState.activeDiamond.x = startPostionActiveDiamond;
                                    diamond.x = startPositionDiamond;
                                    // level1[gameState.activeDiamond.index] = 
                                    gameState.activeIndex = null;
                                    gameState.activeDiamond = null;
                                    gameState.move = false;
                                    gameState.isMoving = false;
                                }
                            }
                            app.ticker.add(diamondMoveBackTicker); 
                            
                        }
                    }
                }
                app.ticker.add(diamondMoveTicker)
            }
            if(direction === 'down') {
                diamondTickerOff(gameState.activeDiamond);
                const startPostionActiveDiamond = gameState.activeDiamond.y;
                const startPositionDiamond = diamond.y;
                const finalPositionActiveDiamond = gameState.activeDiamond.y + 100;
                const finalPositionDiamond = diamond.y - 100;
                diamondSwitch.play();
                const diamondMoveTicker = () => {
                    gameState.isMoving = true;
                    diamond.y -= stepValue;
                    gameState.activeDiamond.y += stepValue;
                    stepValue += 0.4;
                    value += stepValue;
                    if(value >= sizeRect) {
                        value = 0;
                        stepValue = 1;
                        app.ticker.remove(diamondMoveTicker);
                        gameState.activeDiamond.y = finalPositionActiveDiamond;
                        diamond.y = finalPositionDiamond;
                        level[gameState.activeDiamond.index] = diamond.color;
                        level[diamond.index] = gameState.activeDiamond.color;
                        if(gameState.activeDiamond.color === 'bomb') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(gameState.activeDiamond.color === 'row') { 
                            gameState.activeDiamond.index = diamond.index;
                            diamond.index = gameState.activeIndex;
                            diamondArr[gameState.activeDiamond.index] = gameState.activeDiamond;
                            diamondArr[diamond.index] = diamond;

                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'bomb') {
                            // diamond.index = gameState.activeIndex;

                            gameState.activeDiamond.index = diamond.index;
                            diamond.index = gameState.activeIndex;
                            diamondArr[gameState.activeDiamond.index] = gameState.activeDiamond;
                            diamondArr[diamond.index] = diamond;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'row') {
                            diamondArr[diamond.index] = gameState.activeDiamond;
                            diamondArr[gameState.activeIndex] = diamond;
                            gameState.activeDiamond.index = diamond.index;
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(checkCombination()) {
                            diamondArr[diamond.index] = gameState.activeDiamond; 
                            gameState.activeDiamond.index = diamond.index; 
                            diamond.index = gameState.activeIndex;
                            gameState.activeIndex = null;
                            diamondArr[diamond.index] = diamond;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            // gameState.isMoving = false;
                            diamondExplosionSound.play();
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            })
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            
                        }

                        else{
                            level[gameState.activeDiamond.index] = gameState.activeDiamond.color;
                            level[diamond.index] = diamond.color;
                            console.log(level)
                            diamondSwitchBack.play();
                            movesAmountChange();
                            const diamondMoveBackTicker = () => {
                                diamond.y += stepValue;
                                gameState.activeDiamond.y -= stepValue;
                                stepValue += 0.4;
                                value += stepValue;
                                if(value >= sizeRect) {
                                    value = 0;
                                    stepValue = 1;
                                    app.ticker.remove(diamondMoveBackTicker);
                                    gameState.activeDiamond.y = startPostionActiveDiamond;
                                    diamond.y = startPositionDiamond;
                                    // level1[gameState.activeDiamond.index] = 
                                    gameState.activeIndex = null;
                                    gameState.activeDiamond = null;
                                    gameState.move = false;
                                    gameState.isMoving = false;
                                }
                            }
                            app.ticker.add(diamondMoveBackTicker); 
                            
                        }
                    }
                }
                app.ticker.add(diamondMoveTicker)
            }
            if(direction === 'up') {
                diamondTickerOff(gameState.activeDiamond);
                const startPostionActiveDiamond = gameState.activeDiamond.y;
                const startPositionDiamond = diamond.y;
                const finalPositionActiveDiamond = gameState.activeDiamond.y - 100;
                const finalPositionDiamond = diamond.y + 100;
                diamondSwitch.play();
                const diamondMoveTicker = () => {
                    gameState.isMoving = true;
                    diamond.y += stepValue;
                    gameState.activeDiamond.y -= stepValue;
                    stepValue += 0.4;
                    value += stepValue;
                    if(value >= sizeRect) {
                        value = 0;
                        stepValue = 1;
                        app.ticker.remove(diamondMoveTicker);
                        gameState.activeDiamond.y = finalPositionActiveDiamond;
                        diamond.y = finalPositionDiamond;
                        level[gameState.activeDiamond.index] = diamond.color;
                        level[diamond.index] = gameState.activeDiamond.color;
                        if(gameState.activeDiamond.color === 'bomb') {
                            gameState.activeDiamond.index = diamond.index; 
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(gameState.activeDiamond.color === 'row') {
                            gameState.activeDiamond.index = diamond.index;
                            diamond.index = gameState.activeIndex;
                            diamondArr[gameState.activeDiamond.index] = gameState.activeDiamond;
                            diamondArr[diamond.index] = diamond;

                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(gameState.activeDiamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'bomb') {
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bombBonus(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(diamond.color === 'row') {
                            diamondArr[diamond.index] = gameState.activeDiamond;
                            diamondArr[gameState.activeIndex] = diamond;
                            gameState.activeDiamond.index = diamond.index;
                            diamond.index = gameState.activeIndex;
                            checkCombination(); 
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            });
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            bonusRow(diamond.index);
                            gameState.activeIndex = null;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            diamondExplosionSound.play();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                            return;
                        }
                        if(checkCombination()) {
                            diamondArr[diamond.index] = gameState.activeDiamond; 
                            gameState.activeDiamond.index = diamond.index; 
                            diamond.index = gameState.activeIndex;
                            gameState.activeIndex = null;
                            diamondArr[diamond.index] = diamond;
                            gameState.activeDiamond = null;
                            gameState.move = false;
                            // gameState.isMoving = false;
                            diamondExplosionSound.play();
                            toRemove.forEach((element) => {
                                animationDestroyDiamond(diamondArr[element]);
                                diamondArr[element] = '';
                            })
                            targerCheck(toRemove.length);
                            movesAmountChange();
                            diamondsGravity(diamondArr, level);
                            createNewDiamonds(); 
                            setTimeout(() => {
                                recursionCombination();
                            },1000)
                        }

                        else{
                            level[gameState.activeDiamond.index] = gameState.activeDiamond.color;
                            level[diamond.index] = diamond.color;
                            console.log(level)
                            diamondSwitchBack.play();
                            movesAmountChange();
                            const diamondMoveBackTicker = () => {
                                diamond.y -= stepValue;
                                gameState.activeDiamond.y += stepValue;
                                stepValue += 0.4;
                                value += stepValue;
                                if(value >= sizeRect) {
                                    value = 0;
                                    stepValue = 1;
                                    app.ticker.remove(diamondMoveBackTicker);
                                    gameState.activeDiamond.y = startPostionActiveDiamond;
                                    diamond.y = startPositionDiamond;
                                    // level1[gameState.activeDiamond.index] = 
                                    gameState.activeIndex = null;
                                    gameState.activeDiamond = null;
                                    gameState.move = false;
                                    gameState.isMoving = false;
                                }
                            }
                            app.ticker.add(diamondMoveBackTicker); 
                            
                        }
                    }
                }
                app.ticker.add(diamondMoveTicker);
            }
        }

        else {
            diamondTickerOff(gameState.activeDiamond);
            diamondTickerOn(diamond);
            gameState.activeDiamond = diamond;
            gameState.activeIndex = diamond.index;
        }
    }
    console.log(diamondArr, level)
}

const diamondTickerOn = (diamond) => {
        let value = 0;
        let stepValue = 0.06;
        let offsetOuter = 4;
        let offsetInner = 2;
        gameState.backLightTicker = true;
        
        backlightTicker = () => {
            value += stepValue;
            diamond.filters[0].outerStrength = offsetOuter * (Math.cos(value) + 2) / 2;
            diamond.filters[0].innerStrength = offsetInner * (Math.cos(value) + 2) / 2;
        }

        app.ticker.add(backlightTicker);
}

const diamondTickerOff = (diamond) => {
    app.ticker.remove(backlightTicker);
    gameState.backLightTicker = false;
    diamond.filters[0].innerStrength = 0;
    diamond.filters[0].outerStrength = 0;
}

const checkCombination = () => {
    toRemove = [];
    let width = widthField - 2;
    let counterWidth = 1;
    let counterHeight = 1;
    let index = 0;
    let indexVertical = 0;
    let isCombination = false;
    while(index <= level.length - 3) {
        
        if(counterWidth === width) {
        
            if(level[index] !== 'bomb' && level[index] !== 'row' && level[index] === level[index + 1] && level[index] === level[index + 2]) {
                toRemove.push(index, index + 1, index + 2);
                isCombination = true;
            } 
            index += 3;
            counterWidth = 1;
        }

        else{

            if(level[index] !== 'bomb' && level[index] !== 'row' && level[index] === level[index + 1] && level[index] === level[index + 2]) {
                toRemove.push(index, index + 1, index + 2);
                isCombination = true;
            } 
            index += 1;
            counterWidth += 1;
        }
        
       
    }

    while (indexVertical <= (level.length - 1) - widthField * 2) {
        if(counterHeight === width) {
        
            if(level[indexVertical] !== 'bomb' && level[indexVertical] !== 'row' && level[indexVertical] === level[indexVertical + widthField] && level[indexVertical] === level[indexVertical + widthField * 2]) {
                toRemove.push(indexVertical, indexVertical + widthField, indexVertical + widthField * 2);
                isCombination = true;
            } 
            indexVertical -= 17;
            counterHeight = 1;
        }

        else{

            if(level[indexVertical] !== 'bomb' && level[indexVertical] !== 'row' && level[indexVertical] === level[indexVertical + widthField] && level[indexVertical] === level[indexVertical + widthField * 2]) {
                toRemove.push(indexVertical, indexVertical + widthField, indexVertical + widthField * 2);
                isCombination = true;
            } 
            indexVertical += widthField;
            counterHeight += 1;
        }
    }

    toRemove = [...new Set(toRemove)];
    
    return isCombination;
}

export const recursionCombination = () => {
    // gameState.isMoving = true;
    if(checkCombination()) {
        toRemove.forEach((element) => {
                animationDestroyDiamond(diamondArr[element]);
                diamondArr[element] = '';
        })
        targerCheck(toRemove.length);
        diamondExplosionSound.play();
        diamondsGravity(diamondArr, level); 
        createNewDiamonds();
        if(!isMovePossible) {
            clearDiamonds();
            createNewDiamonds();
        }
        setTimeout(() => {
           
            recursionCombination();
            
        },1000)
    }

    else{
        gameState.isMoving = false;
    }
    
}

const isMovePossible = () => {
    let activeColor = '';
    for(let i = 0; i < level.length; i++) {
        activeColor = level[i];
        if(activeColor = 'bomb') {
            return false;
        }
        if(activeColor = 'row') {
            return false;
        }
        if((i + 1) % widthField !== 0 && i < level.length - 1) {
            level[i] = level[i + 1];
            level[i + 1] = activeColor;
            if(checkCombination()){
                toRemove = [];
                level[i + 1] = level[i];
                level[i] = activeColor;
                return true;
            }
            else{
                level[i + 1] = level[i];
                level[i] = activeColor;
            }
        }
        if(i % widthField !== 0) {
            level[i] = level[i - 1];
            level[i - 1] = activeColor;
            if(checkCombination()){
                toRemove = [];
                level[i - 1] = level[i];
                level[i] = activeColor;
                return true;
            }
            else {
                level[i - 1] = level[i];
                level[i] = activeColor;
            }
        }
        if(i >= widthField) {
            level[i] = level[i - widthField];
            level[i - widthField] = activeColor;
            if(checkCombination()) {
                toRemove = [];
                level[i - widthField] = level[i];
                level[i] = activeColor;
                return true;
            }
            else {
                level[i - widthField] = level[i];
                level[i] = activeColor;
            } 
        }
        if(i < level.length - widthField) {
            level[i] = level[i + widthField];
            level[i + widthField] = activeColor;
            if(checkCombination()) {
                toRemove = [];
                level[i + widthField] = level[i];
                level[i] = activeColor;
                return true;
            }
            else {
                level[i + widthField] = level[i];
                level[i] = activeColor;
            }
        }
    }
    return false;
}

export const clearDiamonds = () => {
    for(let i = 0; i < fieldSize; i++) {
        diamondArr[i].destroy({children: true});
        diamondArr[i] = undefined;
        level[i] = '';
    }
}

// const animationDestroyDiamond = (diamond) => {
//     let value = 1;
//     diamond.anchor.set(0.5);
//     const animation = () => {
        
//         value -= 0.03;
//         diamond.scale.set(value);
        
//         diamond.rotation += 0.1;
       
//         if(value <= 0) {
//             value = 1;
//             app.ticker.remove(animation);
//             diamond.destroy({children: true});
//         }
//     }
//     app.ticker.add(animation);
// }

export const animationDestroyDiamond = (diamond) => {
    // Сохраняем исходный размер, чтобы уменьшение было относительно него
    const originalScaleX = diamond.scale.x;
    const originalScaleY = diamond.scale.y;

    // Центр для вращения и уменьшения
    diamond.anchor.set(0.5);

    // Если нужно, скорректируем позицию, чтобы центр совпадал
    diamond.x += diamond.width / 2;
    diamond.y += diamond.height / 2;

    let progress = 0;           // от 0 до 1
    const speed = 0.02;         // скорость анимации

    const ticker = () => {
        progress += speed;
        if (progress >= 1) {
            // Завершаем анимацию
            app.ticker.remove(ticker);
            if (diamond.parent) diamond.parent.removeChild(diamond);
            diamond.destroy({ children: true });
            return;
        }

        // Плавное уменьшение
        diamond.scale.set(
            originalScaleX * (1 - progress),
            originalScaleY * (1 - progress)
        );

        // Вращение
        diamond.rotation += 0.2;

        // Плавное исчезновение
        diamond.alpha = 1 - progress;
    };

    app.ticker.add(ticker);
};



