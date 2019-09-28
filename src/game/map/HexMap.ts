import * as PIXI from 'pixi.js';
import { TextureData } from '../../utils/TextureData';
import { HexTile } from './HexTile';

export interface IHexMap {
  across: number;
  down: number;
  scale: number;
}

// export class HexMap extends PIXI.Container {
export class HexMap extends PIXI.ParticleContainer {
  tiles: HexTile[] = [];
  root23: number = Math.sqrt(2/3);

  start: {x: number, y: number};

  getWidth(): number {
    return (this.config.across + 0.5) * this.config.scale * 100;
  }

  getHeight(): number {
    return (this.config.down + 0.5) * this.config.scale * 100 * this.root23;
  }

  constructor(private config: IHexMap){
    super(100000, {position: true, tint: true});
    // this.visible = false;
    // super();
    let perAcross = config.scale * 100;
    let perDown = config.scale * this.root23 * 100;

    for (let y = 0; y < config.down; y++) {
      for (let x = 0; x <config.across; x++) {
        let tile = new HexTile(TextureData.hex);
        tile.scale.set(config.scale);
        tile.position.set((x + (y % 2 === 0 ? 0.5 : 0)) * perAcross, y * perDown);
        this.addChild(tile);
        let i = y * config.across + x;
        this.tiles[i] = tile;
        if (i >= config.across) {
          if (y % 2 === 0) {
            this.connectTiles(tile, this.tiles[i - config.across]);
            if ((i - config.across) % config.across !== config.across - 1) {
              this.connectTiles(tile, this.tiles[i - config.across + 1]);
            }
          } else {
            this.connectTiles(tile, this.tiles[i - config.across]);
            if ((i - config.across) % config.across !== 0) {
              this.connectTiles(tile, this.tiles[i - config.across - 1]);
            }
          }
          
        }
        if (i % config.across !== 0) {
          this.connectTiles(tile, this.tiles[i - 1]);
        }
      }
    }
  }

  connectTiles(tile1: HexTile, tile2: HexTile) {
    tile1.connections.push(tile2);
    tile2.connections.push(tile1);
  }

  getTileAt(pos: {x: number, y: number}) {
    let y = Math.floor(pos.y / this.config.scale / 100 / this.root23);
    let x = Math.floor(pos.x / this.config.scale / 100 - (y % 2 === 0 ? 0.5 : 0));
    
    return this.tiles[y * this.config.across + x];
  }

  makePathPriority(start: {x: number, y: number}) {
    this.start = start;
  }
}