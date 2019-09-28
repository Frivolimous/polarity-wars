
import { CONFIG } from '../Config';
import * as _ from 'lodash';
import * as PIXI from 'pixi.js';
import { JMInteractionEvents, IKeyboardEvent } from '../JMGE/events/JMInteractionEvents';
import { GameEvents } from '../utils/GameEvents';
import { HexMap } from './map/HexMap';
import { HexConfig, HexTile } from './map/HexTile';

export class GameManager {
  public running = true;
  public interactive = true;

  public display = new  PIXI.Container();

  private hexMap: HexMap;
  private spawnTile: HexTile;

  constructor(private levelIndex: number = 0, private difficulty: number = 1) {
    // this.hexMap = new HexMap({ across: 5, down: 5, scale: 1});
    // this.hexMap = new HexMap({ across: 40, down: 40, scale: 0.2});
    this.hexMap = new HexMap({ across: 20, down: 20, scale: 0.4});
    // this.hexMap = new HexMap({ across: 100, down: 100, scale: 0.08});
    let background = new PIXI.Graphics();
    background.beginFill(0, 0.01);
    background.drawRect(0, 0, this.hexMap.getWidth(), this.hexMap.getHeight());
    this.display.addChild(background);
    this.display.addChild(this.hexMap);

    GameEvents.ticker.add(this.onTick);
    this.display.addListener("pointerdown", this.mouseDown);
    this.display.addListener("pointerup", this.mouseUp);
    this.display.addListener("pointermove", this.mouseMove);
    this.display.interactive = true;
    // this.display.interactiveChildren = false;
    // this.hexMap.interactive = true;
    // this.hexMap.interactiveChildren = false;
    window.addEventListener('keydown', this.keyDown);
    // JMInteractionEvents.MOUSE_DOWN.addListener(this.mouseDown);
  }

  public dispose = () => {
    console.log('dispose');
    GameEvents.ticker.remove(this.onTick);
    JMInteractionEvents.KEY_DOWN.removeListener(this.keyDown);
    this.display.destroy();
  }

  isMouseDown = false;
  lastLoc: PIXI.Point;

  public mouseDown = (e: PIXI.interaction.InteractionEvent) => {
    this.isMouseDown = true;
    this.lastLoc = e.data.getLocalPosition(this.display);
    let tile = this.hexMap.getTileAt(this.lastLoc);
    if (tile) {
      if (e.data.originalEvent.ctrlKey) {
        tile.r = 150;
        tile.b = 255;
        tile.db = !tile.db;
        tile.dr = !tile.dr;
        this.spawnTile = tile;
      } else if (e.data.originalEvent.altKey) {
        tile.g = 0;
        tile.h = 0;
        tile.b = 0;
        tile.db = !tile.db;
        tile.dg = !tile.dg;
      } else if (e.data.originalEvent.shiftKey) {
        tile.b = 25;
        tile.db = !tile.db;
      } else {
        tile.b = 200;
        tile.db = !tile.db;
      }
    }
  }
  public mouseUp = (e: PIXI.interaction.InteractionEvent) => {
    this.isMouseDown = false;
  }
  public mouseMove = (e: PIXI.interaction.InteractionEvent) => {
    this.lastLoc = e.data.getLocalPosition(this.hexMap);
  }

  public keyDown = (e: IKeyboardEvent) => {
    // if (!this.running || !this.interactive) {
      
    //   return;
    // }
    switch (e.key) {
      case 'Escape': {
        this.hexMap.tiles.forEach(tile => tile.reset());
      }
    }
  }

  spawnTick = 0;
  public onTick = (ms: number) => {
    // return;
    this.hexMap.tiles.forEach(tile => {
      tile.adjustValues();
      // tile.updateTint();
    });

    HexTile.MAX_H = _.max(_.map(this.hexMap.tiles, tile => tile.h));

    this.spawnTick--;
    if (this.spawnTile && this.spawnTick < 0) {
      this.spawnTick = SPAWN_FREQ;
      let tile = this.spawnTile;
      tile.nr += 200;
      // let tile = _.sample(this.hexMap.tiles);
      // tile.r += 255;
      // tile.g += 255;
      // tile.b += 255;
      // tile.r += 255;
      // tile.g += 255;
      // tile.b += 255;
    }
    if (!this.running) return;

  }
}

const SPAWN_FREQ = 10;
