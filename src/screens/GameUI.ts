import * as PIXI from 'pixi.js';
import { BaseUI, IFadeTiming } from '../JMGE/UI/BaseUI';
import { GameManager } from '../game/GameManager';
import { Gauge } from '../JMGE/JMBUI';
import { CONFIG } from '../Config';
import { FlyingText } from '../JMGE/effects/FlyingText';
import { MuterOverlay } from '../ui/MuterOverlay';
import { PauseOverlay } from '../ui/PauseOverlay';
import { SoundData } from '../utils/SoundData';
import { IResizeEvent } from '../JMGE/events/JMInteractionEvents';
import { SidePanel } from '../ui/SidePanel';
import { HexConfig } from '../game/map/HexTile';
import { FPSCounter } from '../ui/fpsCounter';

export class GameUI extends BaseUI {
  private manager: GameManager;
  private healthBar: Gauge;

  private pauseOverlay: PauseOverlay;
  private muter: MuterOverlay;
  private wordDisplay: PIXI.Text;
  private progress: PIXI.Text;
  private score: PIXI.Text;

  private background: PIXI.Graphics;

  private fadeTiming: IFadeTiming = {
    color: 0xffffff,
    fadeIn: 2000,
    fadeOut: 500,
    delay: 3000,
    delayBlank: 1000,
  };

  constructor(level: number, difficulty: number) {
    super();
    this.background = new PIXI.Graphics().beginFill(0x777777).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
    this.manager = new GameManager(level, difficulty);
    let sidepanel = new SidePanel(HexConfig);
    sidepanel.x = CONFIG.INIT.SCREEN_WIDTH + 50;
    
    this.addChild(this.background, this.manager.display);
    this.addChild(sidepanel);
    let counter = new FPSCounter();
    counter.x = -100;
    this.addChild(counter);
  }

  public positionElements = (e: IResizeEvent) => {
    this.background.clear().beginFill(0x777777)
      .drawRect(e.outerBounds.x, e.outerBounds.y, e.outerBounds.width, e.outerBounds.height);
  };

  public navOut = () => {
    this.manager.running = false;
    // GameEvents.clearAll();
  }

  public dispose = () => {
    super.dispose();
  }
}
