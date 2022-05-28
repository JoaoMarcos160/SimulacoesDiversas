import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import Prey from '../classes/Prey';
import Construction from '../classes/Contruction';
import Predator from '../classes/Predator';
import Step from '../classes/Step';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import {
  drawContructionSize,
  drawResourceRate,
  getRandomInt,
  maxResourceConstruction,
  randn_bm,
  sortearCorHex,
} from '../funcoes/sorteios';
import Boid from '../classes/Boid';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

const keysDown = ['Down', 'ArrowDown', 'S', 's'];
const keysUp = ['Up', 'ArrowUp', 'W', 'w'];
const keysLeft = ['Left', 'ArrowLeft', 'A', 'a'];
const keysRight = ['Right', 'ArrowRight', 'D', 'd'];

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('txtIdBoid')
  txtIdBoid: ElementRef<HTMLInputElement>;
  @ViewChild('radioTypePrey')
  radioTypePrey: ElementRef<HTMLInputElement>;
  @ViewChild('radioTypePredator')
  radioTypePredator: ElementRef<HTMLInputElement>;
  @ViewChild('radioTypeConstruction')
  radioTypeConstruction: ElementRef<HTMLInputElement>;

  public context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.96,
    // width: 5000,
    // height: 5000,
  };
  public velocity: number = 0; //quanto menor mais rápido
  public frameRate: number = 0;
  public countFrame: number = 0;
  public granulityRuler: number = 25;
  public granulityGrid: number = 25;
  public minDistanceBetweenCostructions: number = 100;
  public minDistanceBetweenBoids: number = 2;
  public distanceToConsumeResources: number = 10;
  private initialNumberOfPredator: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / 250
  );
  private initialNumberOfPreys: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / 50
  );
  private initialNumberOfConstructions: number = Math.ceil(
    Math.max(this.screen.height, this.screen.width) / 75
  );

  private preys: Prey[] = [];
  private predators: Predator[] = [];
  private constructions: Construction[] = [];
  public watch: Boid | Construction = null;
  public objKeys: { property: string; label: string }[] = [];

  public get totalPredators(): number {
    return this.predators.length;
  }
  public get totalPreys(): number {
    return this.preys.length;
  }

  private keysLocalStorage: {
    configs: string;
    arrayPreys: string;
    arrayPredators: string;
    arrayConstructions: string;
  } = {
      configs: '@simulacao:configs',
      arrayPreys: '@simulacao:arrayPreys',
      arrayPredators: '@simulacao:arrayPredators',
      arrayConstructions: '@simulacao:arrayConstructions',
    };

  public config: {
    showFrameRate: boolean;
    showId: boolean;
    showRoutesPreys: boolean;
    showRoutesPredators: boolean;
    showRuler: boolean;
    showGrid: boolean;
    showVisionPreys: boolean;
    showVisionPredators: boolean;
    showResources: boolean;
  } = {
      showFrameRate: true,
      showId: true,
      showRoutesPreys: false,
      showRoutesPredators: false,
      showRuler: false,
      showGrid: false,
      showVisionPreys: false,
      showVisionPredators: false,
      showResources: true,
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
  ) { }

  ngOnInit(): void {
    console.log(this.screen);
    this.getNumberOfPredatorsAndPreys();
    this.loadConfigs();
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
    if (this.route.snapshot.params.predators) {
      if (
        this.route.snapshot.params.predators > 0 &&
        this.route.snapshot.params.predators < 5000
      ) {
        this.initialNumberOfPredator = this.route.snapshot.params.predators;
      }
    }
    if (this.route.snapshot.params.preys) {
      if (
        this.route.snapshot.params.preys > 0 &&
        this.route.snapshot.params.preys < 5000
      ) {
        this.initialNumberOfPreys = this.route.snapshot.params.preys;
      }
    }
  }

  private loadConfigs() {
    const configs = this.localStorageService.get(this.keysLocalStorage.configs);
    if (configs) {
      this.config = configs;
    } else {
      this.localStorageService.set(this.keysLocalStorage.configs, this.config);
    }
    const arrayPreys = this.localStorageService.get(this.keysLocalStorage.arrayPreys);
    if (arrayPreys) {
      this.preys = arrayPreys;
    } else {
      this.createPreys();
    }
    const arrayPredators = this.localStorageService.get(
      this.keysLocalStorage.arrayPredators
    );

    if (arrayPredators) {
      this.predators = arrayPredators;
    } else {
      this.createPredators();
    }
    const arrayConstructions = this.localStorageService.get(
      this.keysLocalStorage.arrayConstructions
    );
    console.log(arrayConstructions);
    if (arrayConstructions) {
      this.constructions = arrayConstructions;
    } else {
      this.createConstructions();
    }
  }

  //control boid 1 (big black boid or if die, the first boid of array)
  private setControls() {
    document.onkeydown = document.onkeyup = (e) => {
      this.keysStates[e.key] = e.type == 'keydown';
      let x = 0;
      let y = 0;
      if (keysDown.filter((key) => this.keysStates[key] === true).length > 0) {
        y = 1;
      } else if (
        keysUp.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        y = -1;
      }

      if (keysRight.filter((key) => this.keysStates[key] === true).length > 0) {
        x = 1;
      } else if (
        keysLeft.filter((key) => this.keysStates[key] === true).length > 0
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
      this.preys.push(
        new Prey(
          i,
          this.screen.width,
          this.screen.height,
          0,
          0,
          this.screen.width / 2 + randn_bm() * 50,
          this.screen.height / 2 + randn_bm() * 50,
          i == 1 ? 20 : 10,
          i == 1 ? '#000000' : sortearCorHex(),
          0.5,
          (Math.abs(randn_bm()) + 10) * 50,
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
        )
      );
    }
  }

  public createPredators() {
    for (let i = 1; i <= this.initialNumberOfPredator; i++) {
      this.predators.push(
        new Predator(
          i,
          this.screen.width,
          this.screen.height,
          0,
          0,
          getRandomInt(1, this.screen.width),
          getRandomInt(1, this.screen.height),
          15,
          '#964b00',
          0.4,
          (Math.round(Math.abs(randn_bm())) + 10) * 50,
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          (Math.abs(randn_bm()) + 10) * 2
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
        this.minDistanceBetweenCostructions
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
        this.minDistanceBetweenCostructions
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
    setInterval(() => {
      //clean all canvas
      this.context.clearRect(0, 0, this.screen.width, this.screen.height);

      //process constructions
      for (const construction of this.constructions) {
        if (new Date().getSeconds() % 10 === 0) {
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
    }, this.velocity);
    if (this.config.showFrameRate) {
      this.showFrameRate();
    }
  }

  private renderPreys(): void {
    for (const prey of this.preys) {
      // prey die
      if (prey.thirst >= 100 || prey.hungry >= 100) {
        this.dieBoid(prey, 'prey');
        return;
      }
      //escape from predators
      const nearbyPredators = prey.boidsNearby(this.predators, true);
      if (nearbyPredators.length > 0) {
        if (prey.distanceOf(nearbyPredators[0]) < getRandomInt(5, 15)) {
          prey.escapeFromPredator(nearbyPredators[0]);
        }
      }

      //avoid others boids
      prey.avoidOtherBoids(this.preys, this.minDistanceBetweenBoids);

      if (prey.steps.length < 1) {
        //ever searching lakes or trees
        if (prey.thirst > prey.hungry) {
          const nearbyLake = prey.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Lake
          );
          if (nearbyLake && nearbyLake.resource > prey.thirst_rate) {
            if (
              prey.distanceOf(nearbyLake) < this.distanceToConsumeResources
            ) {
              prey.drinkWater();
              const index = this.constructions.indexOf(nearbyLake);
              if (index > 0) {
                this.constructions[index].decreasesResources(
                  prey.thirst_rate
                );
              }
            } else {
              prey.tracePathToCoordinate(nearbyLake);
            }
          }
        } else {
          const nearbyTree = prey.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Tree
          );
          if (nearbyTree && nearbyTree.resource > prey.hunger_rate) {
            if (
              prey.distanceOf(nearbyTree) < this.distanceToConsumeResources
            ) {
              prey.eatFood();
              const index = this.constructions.indexOf(nearbyTree);
              if (index > 0) {
                this.constructions[index].decreasesResources(
                  prey.hunger_rate
                );
              }
            } else {
              prey.tracePathToCoordinate(nearbyTree);
            }
          }
        }
        if (prey.steps.length < 1) {
          prey.tracePathToRandomDirection();
        }
      }
      prey.walkAStep();
      this.drawPrey(prey);
    }
  }

  private renderPredators(): void {
    this.context.setLineDash([0, 0]);
    this.context.strokeStyle = '#0d0d0d';
    for (const predator of this.predators) {
      if (predator.thirst >= 100 || predator.hungry >= 100) {
        this.dieBoid(predator, 'predator');
        return;
      }
      //avoid others boids
      predator.avoidOtherBoids(this.predators, this.minDistanceBetweenBoids);
      if (predator.steps.length < 1) {
        //search lakes only thirst below 50
        if (predator.thirst > 50) {
          const nearbyLake = predator.constructionNearest(
            this.constructions,
            true,
            ConstructionTypeEnum.Lake
          );
          if (nearbyLake && nearbyLake.resource > predator.thirst_rate) {
            if (
              predator.distanceOf(nearbyLake) <
              this.distanceToConsumeResources
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
        } else if (predator.hungry > 50) {
          const preys = predator.boidsNearby(this.preys, false);
          if (preys.length > 0) {
            const preyNearby = preys.sort((a, b) =>
              predator.distanceOf(a) < predator.distanceOf(b) ? -1 : 1
            )[0];
            if (predator.distanceOf(preyNearby) < predator.attack_range) {
              predator.eatPrey();
              this.dieBoid(preyNearby, 'prey');
            }
            predator.tracePathToCoordinate(preyNearby, 50);
          }
        }
        predator.clearSteps();
        predator.tracePathToRandomDirection();
      }
      predator.walkAStep();
      this.drawPredator(predator);
    }
  }

  public toWatchBoid() {
    const id = parseInt(this.txtIdBoid.nativeElement.value);
    const typePrey = this.radioTypePrey.nativeElement.checked;
    const typePredator = this.radioTypePredator.nativeElement.checked;
    const typeConstruction = this.radioTypeConstruction.nativeElement.checked;

    if (typePrey) {
      this.watch = this.preys.find((boid) => boid.id === id);
    } else if (typePredator) {
      this.watch = this.predators.find((boid) => boid.id === id);
    } else if (typeConstruction) {
      this.watch = this.constructions.find(
        (construction) => construction.id === id
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
    if (!!obj) {
      return Object.keys(obj)
        .map((property: string) => {
          const key = property.replace(/^_/, '');
          return {
            property: property,
            label: `${key.charAt(0).toUpperCase()}${key.substring(1)}`,
          };
        })
        .filter((element) => element.label !== 'Steps');
    }
    return [];
  }

  public drawPrey(prey: Prey) {
    this.context.fillStyle = prey.color;
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
    this.context.strokeRect(
      predator.x,
      predator.y,
      predator.size,
      predator.size
    );
    //render id
    if (this.config.showId) {
      this.context.fillText(predator.id.toString(), predator.x, predator.y - 1);
    }
    //render visions
    if (this.config.showVisionPredators) {
      this.drawVisionBoid(predator);
    }
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
    this.context.fillStyle = `${boid.color}20`;
    this.context.strokeStyle = `${boid.color}`;
    this.context.beginPath();
    this.context.arc(boid.x, boid.y, boid.vision, 0, Math.PI * 2);
    this.context.fill();
    this.context.stroke();
  }

  public drawRuler() {
    //draw axis x
    for (let i = 0; i < this.screen.width; i += this.granulityRuler) {
      this.context.fillText(i.toString(), i, 10);
    }
    //draw axis y
    for (let i = 0; i < this.screen.height; i += this.granulityRuler) {
      this.context.fillText(i.toString(), 0, i);
    }
  }

  public drawGrid() {
    // draw horizontal lines
    for (
      let i = this.granulityGrid;
      i < this.screen.width;
      i += this.granulityGrid
    ) {
      this.context.setLineDash([5, 3]);
      this.context.beginPath();
      this.context.moveTo(i, 0);
      this.context.lineTo(i, this.screen.height);
      this.context.stroke();
    }
    // draw vertical lines
    for (
      let i = this.granulityGrid;
      i < this.screen.height;
      i += this.granulityGrid
    ) {
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
    if (type === 'predator') {
      const index = this.predators.findIndex(
        (predator) => predator.id === boid.id
      );
      if (index > -1) {
        this.predators.splice(index, 1);
      }
    }
    if (type === 'prey') {
      const index = this.preys.findIndex((prey) => prey.id === boid.id);
      if (index > -1) {
        this.preys.splice(index, 1);
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

  public handleConfigs(key: string, value: any) {
    this.config[key] = value;
    this.localStorageService.set(this.keysLocalStorage.configs, this.config);
  }

  public saveSection() {
    this.localStorageService.set(this.keysLocalStorage.arrayPreys, this.preys);
    this.localStorageService.set(this.keysLocalStorage.arrayPredators, this.predators);
    this.localStorageService.set(
      this.keysLocalStorage.arrayConstructions,
      this.constructions
    );
  }
}
