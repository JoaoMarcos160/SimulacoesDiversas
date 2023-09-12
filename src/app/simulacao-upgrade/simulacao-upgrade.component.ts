import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { uid } from 'uid';
import Boid from '../classes/Boid';
import Construction from '../classes/Contruction';
import Predator from '../classes/Predator';
import Prey from '../classes/Prey';
import Step from '../classes/Step';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import { addTransparencyToRGB } from '../funcoes/core';
import {
  drawContructionSize,
  drawRGBColor,
  drawResourceRate,
  getRandomInt,
  maxResourceConstruction,
  randn_bm,
} from '../funcoes/sorteios';
import { LocalStorageService } from '../services/local-storage.service';

const KEYS_DOWN = ['Down', 'ArrowDown', 'S', 's'];
const KEYS_UP = ['Up', 'ArrowUp', 'W', 'w'];
const KEYS_LEFT = ['Left', 'ArrowLeft', 'A', 'a'];
const KEYS_RIGHT = ['Right', 'ArrowRight', 'D', 'd'];
const KEYS_LOCAL_STORAGE = {
  configs: '@simulacao:configs',
  arrayPreys: '@simulacao:arrayPreys',
  arrayPredators: '@simulacao:arrayPredators',
  arrayConstructions: '@simulacao:arrayConstructions',
  lastSectionSaveIn: '@simulacao:lastSectionSaveIn',
  totalDeadPredators: '@simulacao:totalDeadPredators',
  totalDeadPreys: '@simulacao:totalDeadPreys',
  totalBornPredators: '@simulacao:totalBornPredators',
  totalBornPreys: '@simulacao:totalBornPreys',
} as const;
const GRANULITY_RULER: number = 25;
const GRANULITY_GRID: number = 25;
const MIN_DISTANCE_BETWEEN_CONTRUCTION: number = 100;
const MIN_DISTANCE_BETWEEN_BOIDS: number = 2;
const DISTANCE_TO_CONSUME_RESOURCES: number = 10;
const UID_LENGTH: number = 4;

const PREY_HUNGRY_LEVEL_TO_SEARCH_TREE: number = 15;
const PREY_THIRST_LEVEL_TO_SEARCH_LAKE: number = 25;
const PREDATOR_HUNGRY_LEVEL_TO_SEARCH_PREY: number = 50;
const PREDATOR_THIRST_LEVEL_TO_SEARCH_LAKE: number = 25;

interface IConfig {
  showFrameRate: boolean;
  showId: boolean;
  showRoutesPreys: boolean;
  showRoutesPredators: boolean;
  showRuler: boolean;
  showGrid: boolean;
  showVisionPreys: boolean;
  showVisionPredators: boolean;
  showResources: boolean;
  velocity: number; //the smaller the faster
  autoSave: boolean; //save on close
}

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  @HostListener('window:beforeunload')
  saveOnUnload() {
    if (this.config.autoSave) {
      this.saveSection();
    }
  }

  public txtIdBoid: string;
  public radioTypePrey: boolean;
  public radioTypePredator: boolean;
  public radioTypeConstruction: boolean;
  public choice: string = 'prey';

  public context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.96,
    // width: 5000,
    // height: 5000,
  };
  public frameRate: number = 0;
  public countFrame: number = 0;
  private initialNumberOfPredator: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / 250
  );
  private initialNumberOfPreys: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / 50
  );
  private initialNumberOfConstructions: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / getRandomInt(30, 100)
  );

  private preys: Prey[] = [];
  private predators: Predator[] = [];
  private constructions: Construction[] = [];
  private interval: any; //NodeJS.TimeOut
  public watch: Boid | Construction = null;
  public objKeys: { property: string; label: string }[] = [];
  public totalDeadPreys: number = 0;
  public totalDeadPredators: number = 0;
  public totalBornPreys: number = 0;
  public totalBornPredators: number = 0;
  public lastSave: Date;

  public get totalPredators(): number {
    return this.predators.length;
  }
  public get totalPreys(): number {
    return this.preys.length;
  }

  public config: IConfig = {
    showFrameRate: true,
    showId: true,
    showRoutesPreys: false,
    showRoutesPredators: false,
    showRuler: false,
    showGrid: false,
    showVisionPreys: false,
    showVisionPredators: false,
    showResources: true,
    velocity: 0,
    autoSave: true,
  };

  public images: { [number: number]: any } = Object.keys(ConstructionTypeEnum)
    .filter((key) => /^\d+$/.test(key))
    .reduce((a, v) => {
      a[v] = new Image();
      return a;
    }, {});

  private keysStates: { [string: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('screen', this.screen);
    this.getNumberOfPredatorsAndPreys();
    this.loadConfigs();
    this.loadSavedSection();
    this.setControls();
    this.loadImages();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');

    //click to trace route
    this.canvas.nativeElement.onclick = (e) => {
      this.predators[0].tracePathToCoordinate({ x: e.x, y: e.y }, Infinity);
    };

    //double click to teleport predator
    this.canvas.nativeElement.ondblclick = (e) => {
      this.predators[0].clearSteps();
      this.predators[0].x = e.x;
      this.predators[0].y = e.y;
    };

    //loop
    this.cycle();
  }

  ngOnDestroy() {
    this.saveSection();
  }

  private getNumberOfPredatorsAndPreys() {
    if (this.route.snapshot.queryParams.predators) {
      if (
        this.route.snapshot.queryParams.predators > 0 &&
        this.route.snapshot.queryParams.predators < 5000
      ) {
        this.initialNumberOfPredator =
          this.route.snapshot.queryParams.predators;
      }
    }
    if (this.route.snapshot.queryParams.preys) {
      if (
        this.route.snapshot.queryParams.preys > 0 &&
        this.route.snapshot.queryParams.preys < 5000
      ) {
        this.initialNumberOfPreys = this.route.snapshot.queryParams.preys;
      }
    }
  }

  private loadSavedSection() {
    const arrayPreys = this.localStorageService.get<any[]>(
      KEYS_LOCAL_STORAGE.arrayPreys
    );
    if (arrayPreys) {
      this.preys = arrayPreys.map(
        (element) =>
          new Prey(
            element._id,
            element._width,
            element._height,
            element._id_father,
            element._id_mother,
            element._x,
            element._y,
            element._size,
            element._color,
            element._velocity,
            element._vision,
            element._hunger_rate,
            element._thirst_rate,
            element._mating_rate,
            element._fertility,
            element._steps
          )
      );
    } else {
      this.createPreys();
    }
    const arrayPredators = this.localStorageService.get<any[]>(
      KEYS_LOCAL_STORAGE.arrayPredators
    );

    if (arrayPredators) {
      this.predators = arrayPredators.map(
        (element) =>
          new Predator(
            element._id,
            element._width,
            element._height,
            element._id_father,
            element._id_mother,
            element._x,
            element._y,
            element._size,
            element._color,
            element._velocity,
            element._vision,
            element._hunger_rate,
            element._thirst_rate,
            element._mating_rate,
            element._fertility,
            element._attack_range,
            element._preys_eaten,
            element._steps
          )
      );
    } else {
      this.createPredators();
    }
    const arrayConstructions = this.localStorageService.get<any[]>(
      KEYS_LOCAL_STORAGE.arrayConstructions
    );
    if (arrayConstructions) {
      this.constructions = arrayConstructions.map(
        (element) =>
          new Construction(
            element._id,
            element._x,
            element._y,
            element._type,
            element._width,
            element._height,
            element._resource,
            element._resource_rate
          )
      );
    } else {
      this.createConstructions();
    }
    const totalBornPredators = this.localStorageService.get<number>(
      KEYS_LOCAL_STORAGE.totalBornPredators
    );
    if (totalBornPredators) {
      this.totalBornPredators = totalBornPredators;
    }

    const totalBornPreys = this.localStorageService.get<number>(
      KEYS_LOCAL_STORAGE.totalBornPreys
    );
    if (totalBornPreys) {
      this.totalBornPreys = totalBornPreys;
    }

    const totalDeadPredators = this.localStorageService.get<number>(
      KEYS_LOCAL_STORAGE.totalDeadPredators
    );
    if (totalDeadPredators) {
      this.totalDeadPredators = totalDeadPredators;
    }

    const totalDeadPreys = this.localStorageService.get<number>(
      KEYS_LOCAL_STORAGE.totalDeadPreys
    );
    if (totalDeadPreys) {
      this.totalDeadPreys = totalDeadPreys;
    }
    this.loadLastSaveDate();
  }

  private loadLastSaveDate() {
    this.lastSave = this.localStorageService.get(
      KEYS_LOCAL_STORAGE.lastSectionSaveIn
    );
  }

  private loadConfigs() {
    const configs = this.localStorageService.get(KEYS_LOCAL_STORAGE.configs);
    if (configs) {
      this.config = configs;
      return;
    }
    this.saveConfigs();
  }

  //control boid 1 (big black boid or if die, the first boid of array)
  private setControls() {
    document.onkeydown = document.onkeyup = (e) => {
      this.keysStates[e.key] = e.type == 'keydown';
      let x = 0;
      let y = 0;
      if (KEYS_DOWN.filter((key) => this.keysStates[key] === true).length > 0) {
        y = 1;
      } else if (
        KEYS_UP.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        y = -1;
      }

      if (
        KEYS_RIGHT.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        x = 1;
      } else if (
        KEYS_LEFT.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        x = -1;
      }

      for (let i = 0; i < 10; i++) {
        this.preys[0].addStep(new Step(x, y));
      }
    };
  }

  public loadImages() {
    for (const image of Object.keys(this.images)) {
      switch (image) {
        case ConstructionTypeEnum.Bush.toString():
          this.images[image].src = '../../assets/bush.png';
          break;
        case ConstructionTypeEnum.Tree.toString():
          this.images[image].src = '../../assets/tree.png';
          break;
        case ConstructionTypeEnum.Rock.toString():
          this.images[image].src = '../../assets/rock.png';
          break;
        case ConstructionTypeEnum.Lake.toString():
          this.images[image].src = '../../assets/lake.png';
          break;
        default:
          this.images[image].src = '';
          console.error(`Construction not found! value: ${image}`);
          break;
      }
    }
  }

  public createPreys() {
    for (let i = 1; i <= this.initialNumberOfPreys; i++) {
      this.totalBornPreys++;
      this.preys.push(
        new Prey(
          uid(UID_LENGTH),
          this.screen.width,
          this.screen.height,
          '',
          '',
          this.screen.width / 2 + randn_bm() * 50,
          this.screen.height / 2 + randn_bm() * 50,
          i == 1 ? 30 : getRandomInt(5, 30),
          i == 1 ? 'rgb(0,0,0)' : drawRGBColor(),
          (Math.abs(randn_bm()) + getRandomInt(1, 5)) * 0.05,
          (Math.abs(randn_bm()) + getRandomInt(2, 10)) * 50,
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10)
        )
      );
    }
  }

  public createPredators() {
    for (let i = 1; i <= this.initialNumberOfPredator; i++) {
      this.totalBornPredators++;
      this.predators.push(
        new Predator(
          uid(UID_LENGTH),
          this.screen.width,
          this.screen.height,
          '',
          '',
          getRandomInt(1, this.screen.width),
          getRandomInt(1, this.screen.height),
          getRandomInt(10, 15),
          'rgb(150,75,0)',
          (Math.abs(randn_bm()) + getRandomInt(1, 5)) * 0.1,
          (Math.abs(randn_bm()) + getRandomInt(2, 10)) * 50,
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 5),
          (Math.abs(randn_bm()) + getRandomInt(2, 10)) * 3
        )
      );
    }
  }

  public createConstructions() {
    const constructionsStandard: ConstructionTypeEnum[] = [
      ConstructionTypeEnum.Tree,
      ConstructionTypeEnum.Lake,
    ];

    for (const constructionType of constructionsStandard) {
      const size = drawContructionSize(constructionType);
      const { x, y } = this.xAndYFarOfConstructions(
        getRandomInt(1, this.screen.width - size.width),
        getRandomInt(1, this.screen.height - size.height),
        size,
        MIN_DISTANCE_BETWEEN_CONTRUCTION
      );

      this.constructions.push(
        Object.seal(
          new Construction(
            this.constructions.length + 1,
            x,
            y,
            constructionType,
            size.width,
            size.height,
            maxResourceConstruction(
              Math.max(size.height, size.width),
              constructionType
            ),
            drawResourceRate(ConstructionTypeEnum.Tree)
          )
        )
      );
    }
    for (let i = 1; i <= this.initialNumberOfConstructions; i++) {
      const type: ConstructionTypeEnum = getRandomInt(0, 4);
      const size = drawContructionSize(type);
      const { x, y } = this.xAndYFarOfConstructions(
        getRandomInt(1, this.screen.width - size.width),
        getRandomInt(1, this.screen.height - size.height),
        size,
        MIN_DISTANCE_BETWEEN_CONTRUCTION
      );
      this.constructions.push(
        Object.seal(
          new Construction(
            this.constructions.length + 1,
            x,
            y,
            type,
            size.width,
            size.height,
            maxResourceConstruction(Math.max(size.height, size.width), type),
            drawResourceRate(ConstructionTypeEnum.Tree)
          )
        )
      );
    }
  }

  public cycle() {
    this.interval = setInterval(() => {
      //clean all canvas
      this.context.clearRect(0, 0, this.screen.width, this.screen.height);

      //process constructions
      if (new Date().getSeconds() % 10 === 0) {
        for (const construction of this.constructions) {
          construction.increasesResources();
        }
      }

      //render preys
      this.renderPreys();

      //render predators
      this.renderPredators();

      //render routes
      if (this.config.showRoutesPreys) {
        this.drawRoutesBoids(this.preys);
      }
      if (this.config.showRoutesPredators) {
        this.drawRoutesBoids(this.predators);
      }

      //render map
      this.mapRender();

      //render ruler
      if (this.config.showRuler) {
        this.context.fillStyle = '#0d0d0ddd';
        this.drawRuler();
      }

      //render grid
      if (this.config.showGrid) {
        this.context.strokeStyle = '#0d0d0d44';
        this.drawGrid();
      }

      this.countFrame++;
    }, this.config.velocity);
    if (this.config.showFrameRate) {
      this.showFrameRate();
    }
  }

  public changeVelocity() {
    clearInterval(this.interval);
    this.handleConfigs('velocity', this.config.velocity);
    this.cycle(); // restart
  }

  private renderPreys(): void {
    for (const prey of this.preys) {
      // prey die
      if (prey.thirst >= 100 || prey.hungry >= 100) {
        this.dieBoid(prey, 'prey');
        continue;
      }
      //escape from predators
      const nearbyPredators = prey.boidsNearby(this.predators, true);
      if (nearbyPredators.length > 0) {
        if (prey.distanceOf(nearbyPredators[0]) < getRandomInt(5, 15)) {
          prey.escapeFromPredator(nearbyPredators[0]);
        }
      }

      //avoid others boids
      prey.avoidOtherBoids(this.preys, MIN_DISTANCE_BETWEEN_BOIDS);

      if (prey.quantitySteps < 1) {
        //seach a partner
        if (prey.readyToMate) {
          const nearbyPreys = prey.boidsNearby(this.preys, true) as Prey[];
          if (nearbyPreys.length > 0) {
            if (
              prey.distanceOf(nearbyPreys[1]) < DISTANCE_TO_CONSUME_RESOURCES
            ) {
              const children = prey.mate(nearbyPreys[1]);
              this.totalBornPreys += children.length;
              this.preys.push(...children);
            } else {
              prey.tracePathToCoordinate(nearbyPreys[1]);
            }
          }
          //ever searching lakes or trees
        } else if (prey.thirst > PREY_THIRST_LEVEL_TO_SEARCH_LAKE) {
          const nearbyLake = prey.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Lake
          );
          if (nearbyLake && nearbyLake.resource > prey.thirst_rate) {
            if (prey.distanceOf(nearbyLake) < DISTANCE_TO_CONSUME_RESOURCES) {
              prey.drinkWater();
              const index = this.constructions.indexOf(nearbyLake);
              if (index > 0) {
                this.constructions[index].decreasesResources(prey.thirst_rate);
              }
            } else {
              prey.tracePathToCoordinate(nearbyLake);
            }
          }
        } else if (prey.hungry > PREY_HUNGRY_LEVEL_TO_SEARCH_TREE) {
          const nearbyTree = prey.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Tree
          );
          if (nearbyTree && nearbyTree.resource > prey.hunger_rate) {
            if (prey.distanceOf(nearbyTree) < DISTANCE_TO_CONSUME_RESOURCES) {
              prey.eatFood();
              const index = this.constructions.indexOf(nearbyTree);
              if (index > 0) {
                this.constructions[index].decreasesResources(prey.hunger_rate);
              }
            } else {
              prey.tracePathToCoordinate(nearbyTree);
            }
          }
        }

        if (prey.quantitySteps < 1) {
          prey.tracePathToRandomDirection();
        }
      }
      prey.walkAStep();
      this.drawPrey(prey);
    }
  }

  private renderPredators(): void {
    this.context.setLineDash([0, 0]);
    for (const predator of this.predators) {
      if (predator.thirst >= 100 || predator.hungry >= 100) {
        this.totalDeadPredators++;
        this.dieBoid(predator, 'predator');
        continue;
      }
      //avoid others boids
      predator.avoidOtherBoids(this.predators, MIN_DISTANCE_BETWEEN_BOIDS);
      if (predator.quantitySteps < 1) {
        if (predator.readyToMate) {
          const nearbyPredators = predator.boidsNearby(
            this.predators,
            true
          ) as Predator[];
          if (nearbyPredators.length > 0) {
            if (
              predator.distanceOf(nearbyPredators[1]) <
              DISTANCE_TO_CONSUME_RESOURCES
            ) {
              const children = predator.mate(nearbyPredators[1]);
              this.totalBornPredators += children.length;
              this.predators.push(...children);
            } else {
              predator.tracePathToCoordinate(nearbyPredators[1]);
            }
          }
        }
        //search lakes only thirst below PREDATOR_THIRST_LEVEL_TO_SEARCH_LAKE
        else if (predator.thirst > PREDATOR_THIRST_LEVEL_TO_SEARCH_LAKE) {
          const nearbyLake = predator.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Lake
          );
          if (nearbyLake && nearbyLake.resource > predator.thirst_rate) {
            if (
              predator.distanceOf(nearbyLake) < DISTANCE_TO_CONSUME_RESOURCES
            ) {
              predator.drinkWater();
              const index = this.constructions.indexOf(nearbyLake);
              if (index > 0) {
                this.constructions[index].decreasesResources(
                  predator.thirst_rate
                );
              }
            } else {
              predator.tracePathToCoordinate(nearbyLake);
            }
          }
        } else if (predator.hungry > PREDATOR_HUNGRY_LEVEL_TO_SEARCH_PREY) {
          const preys = predator.boidsNearby(this.preys, true);
          if (preys.length > 0) {
            const preyNearby = preys[0];
            if (predator.distanceOf(preyNearby) < predator.attack_range) {
              predator.eatPrey(preyNearby.size);
              this.dieBoid(preyNearby, 'prey');
            }
            predator.tracePathToCoordinate(preyNearby, 50);
          }
        }
        if (predator.quantitySteps < 1) {
          predator.tracePathToRandomDirection();
        }
      }
      predator.walkAStep();
      this.drawPredator(predator);
    }
  }

  public toWatchBoid() {
    if (this.choice === 'prey') {
      this.watch = this.preys.find((boid) => boid.id === this.txtIdBoid);
    } else if (this.choice === 'predator') {
      this.watch = this.predators.find((boid) => boid.id === this.txtIdBoid);
    } else if (this.choice === 'construction') {
      this.watch = this.constructions.find(
        (construction) => construction.id === +this.txtIdBoid
      );
    }
    if (this.watch) {
      this.objKeys = this.extractKeys(this.watch);
    }
  }

  public unwatchBoid() {
    this.watch = null;
  }

  public extractKeys(
    obj: Boid | Construction
  ): { property: string; label: string }[] {
    if (obj) {
      return Object.keys(obj)
        .map((property: string) => {
          const key = property.replace(/^_/, '');
          return {
            property: property,
            label: `${key.charAt(0).toUpperCase()}${key.substring(1)}`,
          };
        })
        .filter((element) => element.label !== 'Steps')
        .concat([{ property: 'quantitySteps', label: 'Steps' }]);
    }
    return [];
  }

  public drawPrey(prey: Prey) {
    this.context.fillStyle = prey.color;
    if (prey.readyToMate) {
      this.drawBorderRedBoid(prey);
    }
    this.context.fillRect(prey.x, prey.y, prey.size, prey.size);
    //render id
    if (this.config.showId) {
      this.context.fillText(prey.id.toString(), prey.x, prey.y - 1);
    }
    //render visions
    if (this.config.showVisionPreys) {
      this.drawVisionBoid(prey);
    }
  }

  public drawPredator(predator: Predator) {
    this.context.fillStyle = predator.color;
    this.context.fillRect(predator.x, predator.y, predator.size, predator.size);
    if (predator.readyToMate) {
      this.drawBorderRedBoid(predator);
    } else {
      this.context.strokeStyle = '#0d0d0d';
      this.context.strokeRect(
        predator.x,
        predator.y,
        predator.size,
        predator.size
      );
    }
    //render id
    if (this.config.showId) {
      this.context.fillText(predator.id.toString(), predator.x, predator.y - 1);
    }
    //render visions
    if (this.config.showVisionPredators) {
      this.drawVisionBoid(predator);
    }
  }

  private drawBorderRedBoid(boid: Boid) {
    this.context.strokeStyle = 'rgb(255,0,0)';
    this.context.strokeRect(boid.x, boid.y, boid.size, boid.size);
  }

  public mapRender() {
    this.contructionRender();
  }

  public contructionRender() {
    this.context.fillStyle = '#0d0d0d';
    for (const construction of this.constructions) {
      this.context.drawImage(
        this.images[construction.type],
        construction.x,
        construction.y,
        construction.width,
        construction.height
      );

      //render resources by construction
      if (this.config.showResources) {
        this.context.fillText(
          Math.trunc(construction.resource).toString(),
          construction.x,
          construction.y
        );
      }
    }
  }

  public showFrameRate() {
    setInterval(() => {
      this.frameRate = this.countFrame * 2;
      this.countFrame = 0;
    }, 500);
  }

  public drawRoutesBoids(boids: Boid[]) {
    this.context.setLineDash([0, 0]);
    for (const boid of boids) {
      this.context.strokeStyle = boid.color;
      this.context.beginPath();
      let x = boid.x;
      let y = boid.y;
      this.context.moveTo(x, y);
      for (const step of boid.steps) {
        x += step.distance_x * boid.velocity;
        y += step.distance_y * boid.velocity;
        this.context.lineTo(x, y);
      }
      this.context.stroke();
    }
  }

  public drawVisionBoid(boid: Boid) {
    this.context.fillStyle = addTransparencyToRGB(boid.color, 0.2);
    this.context.strokeStyle = boid.color;
    this.context.beginPath();
    this.context.arc(boid.x, boid.y, boid.vision, 0, Math.PI * 2);
    this.context.fill();
    this.context.stroke();
  }

  public drawRuler() {
    //draw axis x
    for (let i = 0; i < this.screen.width; i += GRANULITY_RULER) {
      this.context.fillText(i.toString(), i, 10);
    }
    //draw axis y
    for (let i = 0; i < this.screen.height; i += GRANULITY_RULER) {
      this.context.fillText(i.toString(), 0, i);
    }
  }

  public drawGrid() {
    // draw horizontal lines
    for (let i = GRANULITY_GRID; i < this.screen.width; i += GRANULITY_GRID) {
      this.context.setLineDash([5, 3]);
      this.context.beginPath();
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.screen.height);
      this.context.stroke();
    }
    // draw vertical lines
    for (let i = GRANULITY_GRID; i < this.screen.height; i += GRANULITY_GRID) {
      this.context.beginPath();
      this.context.moveTo(0, i);
      this.context.lineTo(this.screen.width, i);
      this.context.stroke();
    }
  }

  public xAndYFarOfConstructions(
    x: number,
    y: number,
    size: { width: number; height: number },
    minDistanceBetwweenCostructions: number
  ): { x: number; y: number } {
    let i = 0;
    while (i < 200) {
      const anyConstruction = this.constructions.find(
        (construction) =>
          Math.hypot(construction.x - x, construction.y - y) <
          minDistanceBetwweenCostructions
      );
      if (anyConstruction === undefined) {
        break;
      }
      x = getRandomInt(1, this.screen.width - size.width);
      y = getRandomInt(1, this.screen.height - size.height);
      i++;
    }
    return { x: x, y: y };
  }

  private dieBoid(boid: Boid, type: 'predator' | 'prey') {
    if (type === 'prey') {
      const index = this.preys.findIndex((prey) => prey.id === boid.id);
      if (index > -1) {
        this.totalDeadPreys++;
        this.preys.splice(index, 1);
      }
    } else if (type === 'predator') {
      const index = this.predators.findIndex(
        (predator) => predator.id === boid.id
      );
      if (index > -1) {
        this.totalDeadPredators++;
        this.predators.splice(index, 1);
      }
    }
  }

  private generateForest(
    quantityTrees: number,
    centerForestX: number,
    centerForestY: number
  ) {
    for (let i = 0; i < quantityTrees; i++) {
      const size = drawContructionSize(ConstructionTypeEnum.Tree);
      const { x, y } = {
        x: centerForestX + randn_bm(),
        y: centerForestY + randn_bm(),
      };
      this.constructions.push(
        Object.seal(
          new Construction(
            this.constructions.length + 1,
            x,
            y,
            ConstructionTypeEnum.Tree,
            size.width,
            size.height,
            maxResourceConstruction(
              Math.max(size.height, size.width),
              ConstructionTypeEnum.Tree
            ),
            drawResourceRate(ConstructionTypeEnum.Tree)
          )
        )
      );
    }
  }

  public handleConfigs<K extends keyof IConfig>(key: K, value: any) {
    this.config[key] = value;
    this.localStorageService.set(KEYS_LOCAL_STORAGE.configs, this.config);
  }

  public saveConfigs() {
    console.log('Saving configs...');
    this.localStorageService.set(KEYS_LOCAL_STORAGE.configs, this.config);
    console.log('Saved configs!');
  }

  public saveSection() {
    console.log('Saving section...');
    this.localStorageService.set(KEYS_LOCAL_STORAGE.arrayPreys, this.preys);
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.arrayPredators,
      this.predators
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.arrayConstructions,
      this.constructions
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.lastSectionSaveIn,
      new Date()
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.totalBornPredators,
      this.totalBornPredators
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.totalBornPreys,
      this.totalBornPreys
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.totalDeadPredators,
      this.totalDeadPredators
    );
    this.localStorageService.set(
      KEYS_LOCAL_STORAGE.totalDeadPreys,
      this.totalDeadPreys
    );
    this.loadLastSaveDate();
    console.log('Saved section!');
  }

  public resetSection() {
    const confirmResetSection = window.confirm(
      "Are you sure you want to reset the section? This action can't be undone"
    );
    if (confirmResetSection) {
      console.log('Resetting section...');
      this.preys = [];
      this.predators = [];
      this.constructions = [];
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.arrayPreys);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.arrayPredators);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.arrayConstructions);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.lastSectionSaveIn);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.totalBornPredators);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.totalBornPreys);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.totalDeadPredators);
      this.localStorageService.remove(KEYS_LOCAL_STORAGE.totalDeadPreys);
      this.loadLastSaveDate();
      this.createPreys();
      this.createPredators();
      this.createConstructions();
      this.totalBornPredators = 0;
      this.totalBornPreys = 0;
      this.totalDeadPredators = 0;
      this.totalDeadPreys = 0;
      this.saveSection();
      console.log('Reset section!');
    }
  }
}
