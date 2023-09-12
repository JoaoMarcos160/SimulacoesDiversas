import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simulacao-ia',
  templateUrl: './simulacao-ia.component.html',
  styleUrls: ['./simulacao-ia.component.scss'],
})
export class SimulacaoIaComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  @ViewChild('canvasIa')
  canvas: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D;
  public screen: { width: number; height: number } = {
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.96,
  };

  private getPopulationSize(): number {
    if (
      Number.isInteger(this.activatedRoute.snapshot.params?.population) &&
      this.activatedRoute.snapshot.params.population > 0 &&
      this.activatedRoute.snapshot.params.population < 5000
    ) {
      return +this.activatedRoute.snapshot.params.population;
    }
    return 20;
  }

  public populationSize = this.getPopulationSize();

  private generation: number = 1;
  private targetOutput: number = 1; // Defina o valor de saída desejado

  private population: any[] = [];
  private network: any;
  private matingPool: any[] = [];

  ngOnInit(): void {
    this.initializePopulation();
    this.initializeNetwork();
    this.evolve();
  }

  initializePopulation() {
    for (let i = 0; i < this.populationSize; i++) {
      const individual = [];
      // Inicialize os pesos do indivíduo aleatoriamente
      // Por exemplo, individual.push(Math.random());
      this.population.push(individual);
    }
  }

  initializeNetwork() {}

  evaluateFitness(individual: any) {
    // Treine o indivíduo e avalie sua precisão
    // Você pode usar seus próprios dados para treinar a rede neural
    // E comparar a saída com o valor de saída desejado (targetOutput)
    const output = this.network.run(individual);
    const fitness = 1 / Math.abs(output - this.targetOutput);
    return fitness;
  }

  evolve() {
    while (this.generation < 100) {
      // Número de gerações desejadas
      this.population.forEach((individual) => {
        individual.fitness = this.evaluateFitness(individual);
      });

      this.matingPool = [];
      this.population.forEach((individual) => {
        const fitnessNormalized = individual.fitness / this.populationSize;
        const n = Math.floor(fitnessNormalized * 100);
        for (let i = 0; i < n; i++) {
          this.matingPool.push(individual);
        }
      });

      this.population = [];
      for (let i = 0; i < this.populationSize; i++) {
        const parentA =
          this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
        const parentB =
          this.matingPool[Math.floor(Math.random() * this.matingPool.length)];
        const child = this.crossover(parentA, parentB);
        this.mutate(child);
        this.population.push(child);
      }

      console.log(
        `Generation ${this.generation} - Best Fitness: ${Math.max(
          ...this.population.map((individual) => individual.fitness)
        )}`
      );
      this.generation++;
    }
  }

  crossover(parentA: any, parentB: any) {
    const child = [];
    // Realize o crossover entre os pais para criar o filho
    // Por exemplo, child.push((parentA[0] + parentB[0]) / 2);
    return child;
  }

  mutate(child: any) {
    // Realize a mutação nos genes do filho
    // Por exemplo, child[0] += (Math.random() - 0.5) * 0.1;
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
