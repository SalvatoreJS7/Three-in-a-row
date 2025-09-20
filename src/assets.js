import * as PIXI from 'pixi.js';



export const assets = async () => {
    const sprites = {};
    sprites.textureSky = await PIXI.Assets.load('assets/textures/sky3.png');
    sprites.bombDiamondSprite = await PIXI.Assets.load('assets/sprites/bonus_bomb_diamond.png');
    sprites.greenDiamondSprite = await PIXI.Assets.load('assets/sprites/green_diamond.png');
    sprites.blueDiamondSprite = await PIXI.Assets.load('assets/sprites/blue_diamond.png');
    sprites.purpleDiamondSprite = await PIXI.Assets.load('assets/sprites/purple_diamond.png');
    sprites.yellowDiamondSprite = await PIXI.Assets.load('assets/sprites/yellow_diamond4.1.png');
    sprites.pauseSprite = await PIXI.Assets.load('assets/sprites/pause2.png');

    return sprites;
}