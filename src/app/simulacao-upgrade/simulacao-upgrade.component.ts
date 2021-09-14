import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Boid from '../classes/Boid';
import {
  getRandomInt,
  randn_bm,
  sortearCorHex,
  sortearTamanhoDoPasso,
} from '../funcoes/sorteios';

@Component({
  selector: 'app-simulacao-upgrade',
  templateUrl: './simulacao-upgrade.component.html',
  styleUrls: ['./simulacao-upgrade.component.scss'],
})
export class SimulacaoUpgradeComponent implements AfterViewInit, OnInit {
  constructor(private route: ActivatedRoute) {}

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;

  public context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: screen.availWidth,
    height: screen.availHeight,
  };
  public velocity: number = 0; //quanto menor mais rápido
  public frameRate: number = 0;
  public countFrame: number = 0;
  private boids: Boid[] = [];
  public config: {
    showFrameRate: boolean;
    showId: boolean;
  } = { showFrameRate: true, showId: true };
  private image = new Image();

  ngOnInit(): void {
    console.log('NgOnInit');
    console.log(this.screen);
    this.image.src = '../../assets/grass_texture.jpg';
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.context = this.canvas.nativeElement.getContext('2d');

    //creating soil pattern
    this.createBoids();

    //loop
    this.cycle();
  }

  public createBoids() {
    for (let i = 1; i <= 50; i++) {
      this.boids.push(
        new Boid(
          i,
          this.screen.width / 2 + randn_bm() * 10,
          this.screen.height / 2 + randn_bm() * 10,
          25,
          sortearCorHex()
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

  public mapRender() {
    this.soilRender();
  }

  public soilRender() {
    this.context.fillStyle = this.context.createPattern(this.image, 'repeat');
    this.context.fillRect(0, 0, this.screen.width, this.screen.height);
  }

  public showFrameRate() {
    setInterval(() => {
      this.frameRate = this.countFrame * 2;
      this.countFrame = 0;
    }, 500);
  }
}
