import * as PIXI from 'pixi.js';
import { fieldSize, heightField, sizeRect, startPositionY, widthField } from './field';
import { app, gameState, level } from './game';
import { createRandomDiamond, diamondArr, } from './diamonds';
import { gravitySound } from './sounds';

export let diamondContainer;
     

export const diamondsGravity = (arr, level) => {
    let currentIndex = 0;
    let value = 0;
    let stepValue = 2;
    const arrMove = [];
    for (let i = 0; i < arr.length; i++) {
        if(!arr[i]) {
            currentIndex = i;
            while (true) {
                if (currentIndex - widthField >= 0 && arr[currentIndex - widthField]) {
                    arrMove.push(arr[currentIndex - widthField]);
                    arr[currentIndex] = arr[currentIndex - widthField];
                    level[currentIndex] = arr[currentIndex - widthField].color;
                    arr[currentIndex].index = currentIndex; 
                    currentIndex -= widthField; 
                }
                else{
                    arr[currentIndex] = '';
                    level[currentIndex] = '';
                    break;
                }      
            }
        }
    }
    const gravityTicker = () => {
        arrMove.forEach(element => {
            element.y += stepValue;
        });

        value += stepValue;

        if (value >= sizeRect) {
            app.ticker.remove(gravityTicker);
        }
    };
    app.ticker.add(gravityTicker)
}

export const createNewDiamonds = () => {

    diamondContainer = new PIXI.Container();
    diamondContainer.zIndex = 2;
    diamondContainer.x = (app.screen.width - widthField * sizeRect) / 2;
    diamondContainer.y = (app.screen.height - heightField * sizeRect) / 2;

    let value = 0;
    let stepValue = 8;
    const arrMove = [];

    for(let i = 0; i < fieldSize; i++) {
        if(!diamondArr[i]) {
            const diamond = createRandomDiamond();
            diamondArr[i] = diamond;
            level[i] = diamond.color;
            diamond.index = i;
            diamond.x = i % widthField * sizeRect;
            const speed = Math.trunc(i / widthField) + 1;
            const startPositionY = 1 + heightField - speed;
            diamond.y = -sizeRect * startPositionY;
            
            const finalPositionY = Math.trunc(i / widthField) * sizeRect;
            arrMove.push([diamond, finalPositionY]);

            setTimeout(() => {
                gravitySound.play();
            },700)
            // const diamondTicker = () => {
            //     arrMove.forEach((element) => {
            //         element[0].y += stepValue;
            //         if(element[0].y >= element[1]){
            //             element[0].y = element[1]
            //             app.ticker.remove(diamondTicker);
            //         }
            //     })
            // }
            // app.ticker.add(diamondTicker);


            // const diamondTicker = () => {
            //     diamond.y += stepValue;
            //     // value += stepValue;
            //     if(diamond.y >= finalPositionY) {
            //         // value = 0;
            //         diamond.y = finalPositionY;
            //         app.ticker.remove(diamondTicker)
                    
            //     }
            // } 
            // app.ticker.add(diamondTicker); 
            

            diamondContainer.addChild(diamond);
        }
    }

    const diamondTicker = () => {
                arrMove.forEach((element) => {
                    element[0].y += stepValue;
                    if(element[0].y >= element[1]){
                        element[0].y = element[1]
                        app.ticker.remove(diamondTicker);
                    }
                })
            }
            app.ticker.add(diamondTicker);

   
    app.stage.addChild(diamondContainer);
}
    

  
            // const diamondTicker = () => {
            //     diamond.y += stepValue;
            //     // value += stepValue;
            //     if(diamond.y >= finalPositionY) {
            //         // value = 0;
            //         diamond.y = finalPositionY;
            //         app.ticker.remove(diamondTicker)
            //     }
            // } 
            // app.ticker.add(diamondTicker); 
                        
                    
                
            
               
                
         


