import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Boid from '../classes/Boid';
import { Contruction } from '../classes/Contruction';
import Predator from '../classes/Predator';
import { ContructionTypeEnum } from '../enums/ContructionTypeEnum';
import { getRandomInt, randn_bm, sortearCorHex } from '../funcoes/sorteios';

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent implements AfterViewInit, OnInit {
  constructor(private route: ActivatedRoute) { }

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

  private boids: Boid[] = [];
  private predators: Predator[] = [];
  private contructions: Contruction[] = [];

  public config: {
    showFrameRate: boolean;
    showId: boolean;
  } = { showFrameRate: true, showId: true };

  ngOnInit(): void {
    console.log('NgOnInit');
    console.log(this.screen);
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

  public createBoids() {
    for (let i = 1; i <= 200; i++) {
      this.boids.push(
        new Boid(
          i,
          this.screen.width / 2 + randn_bm() * 10,
          this.screen.height / 2 + randn_bm() * 10,
          10,
          sortearCorHex(),
          1
        )
      );
    }
  }

  public createPredators() {
    for (let i = 1; i <= 50; i++) {
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
    for (let i = 1; i <= 3; i++) {
      this.contructions.push(
        new Contruction(
          i,
          getRandomInt(1, this.screen.width),
          getRandomInt(1, this.screen.height),
          getRandomInt(0, Object.keys(ContructionTypeEnum).length)
        )
      );
    }
  }

  public cycle() {
    setInterval(() => {
      //clean all canvas
      this.context.clearRect(0, 0, this.screen.width, this.screen.height);

      //render map
      this.mapRender();

      //render boids
      this.boids.forEach((boid) => {
        boid.walk(randn_bm(), randn_bm());
        this.drawBoid(boid);
      });

      //render predators
      this.context.strokeStyle = '#0d0d0d';
      this.predators.forEach((predator) => {
        predator.walk(randn_bm(), randn_bm());
        this.drawPredator(predator);
      });

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
    this.contructions.forEach(contruction => {
      const image = this.context.createImageData(100, 100);
      for (let i = 0; i < image.data.length; i += 4) {
        // let x = (i % 400) / 400 * 200;
        // Percentage in the y direction, times 255
        
        // Modify pixel data
        image.data[i + 0] = 0;        // R value
        image.data[i + 1] = 0;        // G value
        image.data[i + 2] = 255;      // B value
        image.data[i + 3] = 255;      // A value
      }
      this.context.putImageData(image, 20, 20);
    })
    this.context.fill();
  }

  public showFrameRate() {
    setInterval(() => {
      this.frameRate = this.countFrame * 2;
      this.countFrame = 0;
    }, 500);
  }
}
