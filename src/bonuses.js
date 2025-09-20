import * as PIXI from 'pixi.js';
import { app, gameState, level } from './game';
import { diamondArr } from './diamonds';
import { fieldSize, widthField } from './field';

export const bombBonus = (startIndex) => {

    level[startIndex] = null;
    let toRemove = [];

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
    })

    toRemove.forEach((element) => {
        if(!diamondArr[element]) return;
        diamondArr[element].destroy({children: true});
        diamondArr[element] = '';
        level[element] = null;
    })


}