import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import Boid from '../classes/Boid';
import Construction from '../classes/Contruction';
import Predator from '../classes/Predator';
import { Step } from '../classes/Step';
import { ConstructionTypeEnum } from '../enums/ContructionTypeEnum';
import {
  drawContructionSize,
  getRandomInt,
  randn_bm,
  sortearCorHex,
} from '../funcoes/sorteios';

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.9,
  };
  public velocity: number = 0; //quanto menor mais rápido
  public frameRate: number = 0;
  public countFrame: number = 0;
  public granulityRuler: number = 25;
  public granulityGrid: number = 25;

  private boids: Boid[] = [];
  private predators: Predator[] = [];
  private contructions: Construction[] = [];

  public config: {
    showFrameRate: boolean;
    showId: boolean;
    showRoutesBoids: boolean;
    showRuler: boolean;
    showGrid: boolean;
  } = {
    showFrameRate: true,
    showId: true,
    showRoutesBoids: true,
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
  private keysDown = ['Down', 'ArrowDown', 'S', 's'];
  private keysUp = ['Up', 'ArrowUp', 'W', 'w'];
  private keysLeft = ['Left', 'ArrowLeft', 'A', 'a'];
  private keysRight = ['Right', 'ArrowRight', 'D', 'd'];

  constructor(private route: ActivatedRoute) {
    document.onkeydown = document.onkeyup = (e) => {
      this.keysStates[e.key] = e.type == 'keydown';
      let x = 0;
      let y = 0;
      if (
        this.keysDown.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        y = 1;
      } else if (
        this.keysUp.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        y = -1;
      } else {
        y = 0;
      }

      if (
        this.keysRight.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        x = 1;
      } else if (
        this.keysLeft.filter((key) => this.keysStates[key] === true).length > 0
      ) {
        x = -1;
      } else {
        x = 0;
      }

      for (let i = 0; i < 10; i++) {
        this.boids[0].addStep(new Step(x, y));
      }
    };
  }

  ngOnInit(): void {
    console.log('NgOnInit');
    console.log(this.screen);

    this.loadImages();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.context = this.canvas.nativeElement.getContext('2d');

    this.createConstructions();
    this.createBoids();
    this.createPredators();

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
        default:
          this.images[image].src = '';
          console.error(`Construction not found! value: ${image}`);
          break;
      }
    });
    console.log(this.images);
  }

  public createBoids() {
    for (let i = 1; i <= 100; i++) {
      this.boids.push(
        new Boid(
          i,
          this.screen.width,
          this.screen.height,
          this.screen.width / 2 + randn_bm() * 50,
          this.screen.height / 2 + randn_bm() * 50,
          i == 1 ? 20 : 10,
          i == 1 ? '#000000' : sortearCorHex(),
          0.5,
          (Math.round(Math.abs(randn_bm())) + 10) * 50,
          100,
          100
        )
      );
    }
  }

  public createPredators() {
    for (let i = 1; i <= 5; i++) {
      this.predators.push(
        new Predator(
          i,
          getRandomInt(1, this.screen.width),
          getRandomInt(1, this.screen.height),
          15,
          '#964b00'
        )
      );
    }
  }

  public createConstructions() {
    for (let i = 1; i <= 10; i++) {
      const type: ConstructionTypeEnum = getRandomInt(0, 3);
      const size = drawContructionSize(type);
      this.contructions.push(
        Object.seal(
          new Construction(
            i,
            getRandomInt(1, this.screen.width),
            getRandomInt(1, this.screen.height),
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

      //render boids
      this.boids.forEach((boid) => {
        if (boid.steps.length < 1) {
          const trees = boid
            .constructionsNearby(this.contructions)
            .filter(
              (construction) => construction.type === ConstructionTypeEnum.Tree
            );
          if (trees.length > 0) {
            const nearbyTree = trees.sort((a, b) =>
              Math.hypot(a.x - boid.x, a.y - boid.y) <
              Math.hypot(b.x - boid.x, b.y - boid.y)
                ? -1
                : 1
            )[0];
            boid.tracePathToConstruction(nearbyTree);
          }
          // boid.addStep({ distance_x: randn_bm(), distance_y: randn_bm() });
        }
        boid.walkAStep();
        this.drawBoid(boid);
      });

      //render routes
      if (this.config.showRoutesBoids) {
        this.drawRoutesBoids();
      }

      //render predators
      this.context.strokeStyle = '#0d0d0d';
      this.predators.forEach((predator) => {
        predator.walk(randn_bm(), randn_bm());
        this.drawPredator(predator);
      });

      //render map
      this.mapRender();

      //render ruler
      if (this.config.showRuler) {
        this.drawRuler();
      }

      //render grid
      if (this.config.showGrid) {
        this.drawGrid();
      }

      this.countFrame++;
    }, this.velocity);
    if (this.config.showFrameRate) {
      this.showFrameRate();
    }
  }

  public drawBoid(boid: Boid) {
    this.context.fillStyle = boid.color;
    this.context.fillRect(boid.x, boid.y, boid.size, boid.size);
    if (this.config.showId) {
      this.context.fillText(boid.id.toString(), boid.x, boid.y - 1);
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
    this.contructions.forEach((contruction) => {
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

  public drawRoutesBoids() {
    this.context.setLineDash([0, 0]);
    this.boids.forEach((boid) => {
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
}
