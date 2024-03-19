import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.css'
})
export class CardComponent implements OnInit{
  @Input()
  public hero!: Hero;

  ngOnInit(): void {
    if (!this.hero) throw new Error('Hero property is required.');
  }

}