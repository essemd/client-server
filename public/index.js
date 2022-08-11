import { GameClient } from './client/GameClient.js';
import sheetFrames from './otsp_tiles_01.json' assert { type: 'json' };

//let app = new PIXI.Application({ width: 800, height: 600 });
//document.body.appendChild(app.view);

/*let rawSpriteSheet = PIXI.Texture.from('/otsp_tiles_01.png'); 
const spriteSheet = new PIXI.Spritesheet(rawSpriteSheet, sheetFrames); 

let sprite = new PIXI.Sprite(spriteSheet.textures['tile_1.png']);
console.log(sprite);
*/

//let sheetBaseTexture = PIXI.BaseTexture.from('/otsp_tiles_01.png');
//let texture = new PIXI.Texture(sheetBaseTexture, new PIXI.Rectangle(160, 32, 32, 32));
//let sprite = new PIXI.Sprite(texture);

//sprite.position.set(0, 0);
//app.stage.addChild(sprite);

//let container = new PIXI.Container();
//let sprite2 = PIXI.Sprite.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png');
//console.log(sprite2);
//sprite.position.set(0, 0);

//app.stage.addChild(sprite);

//container.addChild(sprite);
//container.render();

let gameClient = new GameClient();
gameClient.init();

// client game loop
setInterval(gameClient.run.bind(gameClient), 16);
