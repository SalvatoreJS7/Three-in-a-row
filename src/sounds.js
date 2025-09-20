import { Howl, Howler } from "howler";

export const diamondExplosionSound = new Howl({
    src: ['assets/sounds/diamond_explosion.mp3'], 
    volume: 0.7,                      
    loop: false,                      
});

export const diamondSwitch = new Howl({
    src: ['assets/sounds/switch.mp3'], 
    volume: 0.5,                      
    loop: false,                       
});

export const diamondSwitchBack = new Howl({
    src: ['assets/sounds/switch_back.mp3'], 
    volume: 0.7,                      
    loop: false,                       
});

export const gravitySound = new Howl({
    src: ['assets/sounds/gravity3.mp3'], 
    volume: 0.1,                      
    loop: false,                       
});

export const bonusBombSound = new Howl({
    src: ['assets/sounds/bonus_bomb_diamond.mp3'], 
    volume: 0.7,                      
    loop: false,                       
});