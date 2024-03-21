import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroService } from '../../services/hero.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_image: new FormControl<string>(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  constructor(
    private heroService: HeroService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero {
    const hero: Hero = this.heroForm.value as Hero;

    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('/edit/')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroService.getHero(id)))
      .subscribe((hero) => {
        if (!hero) this.router.navigateByUrl('/');
        this.heroForm.reset(hero);
      });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroService
        .updateHero(this.currentHero)
        .subscribe((hero) =>
          this.showMessage(`${hero.superhero} actualizado correctamente.`)
        );
      return;
    }
    this.heroService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigate(['heroes/edit', hero.id]);
      this.showMessage(`${hero.superhero} creado correctamente.`);
    });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((resp: boolean) => resp),
        switchMap(() => this.heroService.deleteHero(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigateByUrl('/heroes/list');
        this.showMessage(
          `El héroe ${this.currentHero.superhero} ha sido borrado.`
        );
      });
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
    });
  }

  // onDeleteHero(): void {
  //   if (!this.currentHero.id) throw Error('Hero id is required');

  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: this.heroForm.value,
  //   });

  //   dialogRef.afterClosed().subscribe((resp) => {
  //     if (!resp) return;
  //     this.deleteHero();
  //   });
  // }

  // deleteHero(): void {
  //   this.heroService.deleteHero(this.currentHero.id).subscribe((deleted) => {
  //     if (!deleted) {
  //       this.showMessage('No se ha podido borrar el héroe.');
  //     } else {
  //       this.router.navigateByUrl('/');
  //       this.showMessage('El héroe ha sido borrado.');
  //     }
  //   });
  // }
}
