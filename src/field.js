import * as PIXI from 'pixi.js';
import { app, sprites } from './game';

export let fieldContainer;
export let startPositionY = 0;
export const widthField = 6;
export const heightField = 6;
export const sizeRect = 100;
export const fieldSize = widthField * heightField;

export const createField = async () => {

    let fieldX = 0;
    let fieldY = 0;

    fieldContainer = new PIXI.Container();
    fieldContainer.zIndex = 1;
    // const textureSky = await PIXI.Assets.load('assets/textures/sky3.png');

    for(let i = 0; i < fieldSize; i++) {

        if(fieldX === widthField) {
            fieldY += 1;
            fieldX = 0;
        }

        const field = new PIXI.Graphics();
        field.rect(0, 0, sizeRect, sizeRect).fill(sprites.textureSky);
        
        field.x = fieldX * sizeRect;
        field.y = fieldY * sizeRect;
        field.index = i;
        
        fieldX += 1;
        
        fieldContainer.addChild(field);

    }


    fieldContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    fieldContainer.y = (app.screen.height - heightField * sizeRect) / 2;

    app.stage.addChild(fieldContainer);

    startPositionY = fieldContainer.y;

}

export const clearField = () => {
     fieldContainer.removeChildren().forEach((field) => {
            field.destroy({children: true})
        })
       
}