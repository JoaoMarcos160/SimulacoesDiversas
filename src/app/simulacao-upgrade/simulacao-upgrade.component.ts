import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import Prey from '../classes/Prey';
import Construction from '../classes/Contruction';
import Predator from '../classes/Predator';
import Step from '../classes/Step';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import {
  drawContructionSize,
  getRandomInt,
  randn_bm,
  sortearCorHex,
} from '../funcoes/sorteios';
import Boid from '../classes/Boid';
import { ActivatedRoute } from '@angular/router';

const keysDown = ['Down', 'ArrowDown', 'S', 's'];
const keysUp = ['Up', 'ArrowUp', 'W', 'w'];
const keysLeft = ['Left', 'ArrowLeft', 'A', 'a'];
const keysRight = ['Right', 'ArrowRight', 'D', 'd'];

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('txtIdBoid')
  txtIdBoid: ElementRef<HTMLInputElement>;
  @ViewChild('radioTypePrey')
  radioTypePrey: ElementRef<HTMLInputElement>;
  @ViewChild('radioTypePredator')
  radioTypePredator: ElementRef<HTMLInputElement>;

  public context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.9,
  };
  public velocity: number = 0; //quanto menor mais rápido
  public frameRate: number = 0;
  public countFrame: number = 0;
  public granulityRuler: number = 25;
  public granulityGrid: number = 25;
  public minDistanceBetwweenCostructions: number = 100;
  private initialNumberOfPredator: number = 10;
  private initialNumberOfPreys: number = 100;

  private preys: Prey[] = [];
  private predators: Predator[] = [];
  private constructions: Construction[] = [];
  public watchBoid: Boid = null;
  public boidKeys: { property: string; label: string }[] = [];

  public get totalPredators(): number {
    return this.predators.length;
  }
  public get totalPreys(): number {
    return this.preys.length;
  }

  public config: {
    showFrameRate: boolean;
    showId: boolean;
    showRoutesPreys: boolean;
    showRoutesPredators: boolean;
    showRuler: boolean;
    showGrid: boolean;
  } = {
    showFrameRate: true,
    showId: true,
    showRoutesPreys: false,
    showRoutesPredators: false,
    showRuler: false,
    showGrid: false,
  };

  public images: { [number: number]: any } = Object.keys(ConstructionTypeEnum)
    .filter((key) => /^\d+$/.test(key))
    .reduce((a, v) => {
      a[v] = new Image();
      return a;
    }, {});

  private keysStates: { [string: string]: boolean } = {};

  constructor(private route: ActivatedRoute) {
    //get number of predators and preys
    if (route.snapshot.params.predators) {
      if (
        route.snapshot.params.predators > 0 &&
        route.snapshot.params.predators < 5000
      ) {
        this.initialNumberOfPredator = route.snapshot.params.predators;
      }
    }
    if (route.snapshot.params.preys) {
      if (
        route.snapshot.params.preys > 0 &&
        route.snapshot.params.preys < 5000
      ) {
        this.initialNumberOfPreys = route.snapshot.params.preys;
      }
    }

    //control boid 1 (big black boid)
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
      } else {
        y = 0;
      }

      if (keysRight.filter((key) => this.keysStates[key] === true).length > 0) {
        x = 1;
      } else if (
        keysLeft.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        x = -1;
      } else {
        x = 0;
      }

      for (let i = 0; i < 10; i++) {
        this.preys[0].addStep(new Step(x, y));
      }
    };

    this.createConstructions();
    this.createPreys();
    this.createPredators();
  }

  ngOnInit(): void {
    console.log('NgOnInit');
    console.log(this.screen);

    this.loadImages();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.context = this.canvas.nativeElement.getContext('2d');

    //click to trace route
    this.canvas.nativeElement.onclick = (e) => {
      this.predators[0].tracePathToCoordinate({ x: e.x, y: e.y }, Infinity);
    };

    //double click to teleport predator
    this.canvas.nativeElement.ondblclick = (e) => {
      this.predators[0].x = e.x;
      this.predators[0].y = e.y;
    };

    //loop
    this.cycle();
  }

  public loadImages() {
    Object.keys(this.images).forEach((image) => {
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
    });
  }

  public createPreys() {
    for (let i = 1; i <= this.initialNumberOfPreys; i++) {
      this.preys.push(
        new Prey(
          i,
          this.screen.width,
          this.screen.height,
          this.screen.width / 2 + randn_bm() * 50,
          this.screen.height / 2 + randn_bm() * 50,
          i == 1 ? 20 : 10,
          i == 1 ? '#000000' : sortearCorHex(),
          0.5,
          (Math.abs(randn_bm()) + 10) * 50,
          Math.abs(randn_bm()) + getRandomInt(2, 10),
          Math.abs(randn_bm()) + getRandomInt(2, 10)
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
          getRandomInt(1, this.screen.width),
          getRandomInt(1, this.screen.height),
          15,
          '#964b00',
          0.4,
          (Math.round(Math.abs(randn_bm())) + 10) * 50,
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

    constructionsStandard.forEach((constructionType) => {
      const size = drawContructionSize(constructionType);
      const { x, y } = this.xAndYFarOfConstructions(
        getRandomInt(1, this.screen.width - size.width),
        getRandomInt(1, this.screen.height - size.height),
        size
      );

      this.constructions.push(
        Object.seal(
          new Construction(
            this.constructions.length + 1,
            x,
            y,
            constructionType,
            size.width,
            size.height
          )
        )
      );
    });
    for (let i = 1; i <= getRandomInt(5, 10); i++) {
      const type: ConstructionTypeEnum = getRandomInt(0, 4);
      const size = drawContructionSize(type);
      const { x, y } = this.xAndYFarOfConstructions(
        getRandomInt(1, this.screen.width - size.width),
        getRandomInt(1, this.screen.height - size.height),
        size
      );
      this.constructions.push(
        Object.seal(
          new Construction(
            this.constructions.length + 1,
            x,
            y,
            type,
            size.width,
            size.height
          )
        )
      );
    }
  }

  public cycle() {
    setInterval(() => {
      //clean all canvas
      this.context.clearRect(0, 0, this.screen.width, this.screen.height);

      //render preys
      this.preys.forEach((prey) => {
        // prey die
        if (prey.thirst >= 100 || prey.hungry >= 100) {
          this.dieBoid(prey, 'prey');
          return;
        }
        //escape from predators
        const nearbyPredators = prey
          .boidsNearby(this.predators)
          .sort((a, b) => (prey.distanceOf(a) < prey.distanceOf(b) ? -1 : 1));
        if (nearbyPredators.length > 0) {
          if (prey.distanceOf(nearbyPredators[0]) < 20) {
            prey.escapeFromPredator(nearbyPredators[0]);
          }
        }

        if (prey.steps.length < 1) {
          //ever searching lakes or trees
          if (prey.thirst > prey.hungry) {
            const nearbyLake = prey.constructionNearest(
              this.constructions,
              ConstructionTypeEnum.Lake
            );
            if (nearbyLake) {
              if (prey.distanceOf(nearbyLake) < 5) {
                prey.drinkWater();
              } else {
                prey.tracePathToCoordinate(nearbyLake);
              }
            }
          } else {
            const nearbyTree = prey.constructionNearest(
              this.constructions,
              ConstructionTypeEnum.Tree
            );
            if (nearbyTree) {
              if (prey.distanceOf(nearbyTree) < 5) {
                prey.eatFood();
              } else {
                prey.tracePathToCoordinate(nearbyTree);
              }
            }
          }
          prey.addStep(new Step(randn_bm() * 5, randn_bm() * 5));
        }
        prey.walkAStep();
        this.drawPrey(prey);
      });

      //render predators
      this.context.setLineDash([0, 0]);
      this.context.strokeStyle = '#0d0d0d';
      this.predators.forEach((predator) => {
        if (predator.thirst >= 100 || predator.hungry >= 100) {
          this.dieBoid(predator, 'predator');
          return;
        }
        if (predator.steps.length < 1) {
          //search lakes only thirst below 80
          if (predator.thirst > 50) {
            const nearbyLake = predator
              .constructionsNearby(this.constructions)
              .filter(
                (construction) =>
                  construction.type === ConstructionTypeEnum.Lake
              )
              .sort((a, b) =>
                predator.distanceOf(a) < predator.distanceOf(b) ? -1 : 1
              )[0];
            if (nearbyLake) {
              predator.tracePathToCoordinate(nearbyLake);
            }
          } else if (predator.hungry > 50) {
            const preys = predator.boidsNearby(this.preys);
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

          predator.addStep(new Step(randn_bm() * 2, randn_bm() * 2));
        }
        predator.walkAStep();
        this.drawPredator(predator);
      });

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

  public toWatchBoid() {
    const id = parseInt(this.txtIdBoid.nativeElement.value);
    const typePrey = this.radioTypePrey.nativeElement.checked;
    const typePredator = this.radioTypePredator.nativeElement.checked;

    if (typePrey) {
      this.watchBoid = this.preys.find((boid) => boid.id === id);
    } else if (typePredator) {
      this.watchBoid = this.predators.find((boid) => boid.id === id);
    }
    if (this.watchBoid) {
      this.boidKeys = this.extractKeys(this.watchBoid);
    }
  }

  public extractKeys(boid: Boid): { property: string; label: string }[] {
    if (!!boid) {
      return Object.keys(boid)
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
    if (this.config.showId) {
      this.context.fillText(prey.id.toString(), prey.x, prey.y - 1);
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
    if (this.config.showId) {
      this.context.fillText(predator.id.toString(), predator.x, predator.y - 1);
    }
  }

  public mapRender() {
    this.contructionRender();
  }

  public contructionRender() {
    this.constructions.forEach((contruction) => {
      this.context.drawImage(
        this.images[contruction.type],
        contruction.x,
        contruction.y,
        contruction.width,
        contruction.height
      );
    });
  }

  public showFrameRate() {
    setInterval(() => {
      this.frameRate = this.countFrame * 2;
      this.countFrame = 0;
    }, 500);
  }

  public drawRoutesBoids(boids: Boid[]) {
    this.context.setLineDash([0, 0]);
    boids.forEach((boid) => {
      this.context.strokeStyle = boid.color;
      this.context.beginPath();
      let x = boid.x;
      let y = boid.y;
      this.context.moveTo(x, y);
      boid.steps.forEach((step) => {
        x += step.distance_x * boid.velocity;
        y += step.distance_y * boid.velocity;
        this.context.lineTo(x, y);
      });
      this.context.stroke();
    });
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
    size: { width: number; height: number }
  ): { x: number; y: number } {
    let i = 200;
    while (i > 0) {
      const anyConstruction = this.constructions.find(
        (construction) =>
          Math.hypot(construction.x - x, construction.y - y) <
          this.minDistanceBetwweenCostructions
      );
      if (anyConstruction === undefined) {
        break;
      }
      x = getRandomInt(1, this.screen.width - size.width);
      y = getRandomInt(1, this.screen.height - size.height);
      i--;
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
}
