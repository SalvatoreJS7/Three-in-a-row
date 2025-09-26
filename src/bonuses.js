import * as PIXI from 'pixi.js';
import { app, gameState, level } from './game';
import { animationDestroyDiamond, diamondArr } from './diamonds';
import { fieldContainer, fieldSize, sizeRect, widthField } from './field';
import { targerCheck } from './targets';

export const bombBonus = (startIndex) => {

    level[startIndex] = null;
    let toRemove = [];
    let counterTarget = 0;

    if ((startIndex + 1) % widthField === 0) {
        toRemove.push(startIndex - widthField - 1);
        toRemove.push(startIndex - widthField);
        toRemove.push(startIndex - 1);
        toRemove.push(startIndex);
        toRemove.push(startIndex + widthField - 1);
        toRemove.push(startIndex + widthField);
    }

    else if(startIndex % widthField === 0) {
        toRemove.push(startIndex - widthField);
        toRemove.push(startIndex);
        toRemove.push(startIndex + widthField);
        toRemove.push(startIndex - widthField + 1);
        toRemove.push(startIndex + 1);
        toRemove.push(startIndex + widthField + 1);
    }

    else {
        toRemove.push(startIndex - widthField - 1);
        toRemove.push(startIndex - widthField);
        toRemove.push(startIndex - 1);
        toRemove.push(startIndex);
        toRemove.push(startIndex + widthField - 1);
        toRemove.push(startIndex + widthField);
        toRemove.push(startIndex - widthField + 1);
        toRemove.push(startIndex + 1);
        toRemove.push(startIndex + widthField + 1);
    }

    toRemove = toRemove.filter(element => element >= 0 && element < fieldSize);

    toRemove.forEach((element) => {
        if(level[element] === 'bomb') {
            bombBonus(element);
        }
        if(level[element] === 'row') {
            bonusRow(element);
        }
    })

    toRemove.forEach((element) => {
        if(!diamondArr[element]) return;
        diamondArr[element].destroy({children: true});
        diamondArr[element] = '';
        level[element] = null;
        counterTarget += 1;
    })

    targerCheck(counterTarget);
}

export const bonusRow = (activeIndex) => {
    let counterTarget = 0;
    let activeRow = Math.floor(activeIndex / widthField);
    let startIndex = activeRow * widthField;
    let toRemove = [];
    for (let i = startIndex; i < startIndex + widthField; i++) toRemove.push(i);

    toRemove.forEach((element) => {
        if(level[element] === 'bomb') {
            bombBonus(element);
        }
    })
    
    toRemove.forEach((element) => {
        if(!diamondArr[element]) return;
        // diamondArr[element].destroy({children: true});
        animationDestroyDiamond(diamondArr[element]);
        diamondArr[element] = '';
        level[element] = null;
        counterTarget += 1;
    })

    bonusRowAnimation(activeRow);
    targerCheck(counterTarget);
}

const bonusRowAnimation = (row) => {
    const rowAnimationContainer = new PIXI.Container();
    rowAnimationContainer.zIndex = 4;
    let startPositionX = -(widthField * sizeRect / 2) + 20;
    let finalPositionX = widthField * sizeRect / 2 - 20;
    let positionY = -(widthField * sizeRect / 2) + sizeRect / 2;
    let finalPositionY = positionY + sizeRect * row;

    const rowAnimation = new PIXI.Graphics();
    rowAnimation.setStrokeStyle({ width: 6, color: 0xff0000, alpha: 1 });
    rowAnimation.moveTo(startPositionX, finalPositionY);
    // rowAnimation.lineTo(finalPositionX, finalPositionY);
    // rowAnimation.stroke(); 

    let value = startPositionX;
    const lineTicker = () => {
        value += 25;
        rowAnimation.lineTo(value, finalPositionY);
        rowAnimation.stroke();
        if(value >= finalPositionX) {
            app.ticker.remove(lineTicker);
        }

    }
    app.ticker.add(lineTicker);

    rowAnimationContainer.x = app.screen.width / 2;
    rowAnimationContainer.y = app.screen.height / 2;
    rowAnimationContainer.addChild(rowAnimation);
    app.stage.addChild(rowAnimationContainer);

    setTimeout(() => {
        rowAnimationContainer.destroy({ children: true });
    }, 500);
};