import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';
import { HttpClient } from '@angular/common/http';

@Pipe({
  name: 'heroImage',
})
export class HeroImagePipe implements PipeTransform {
  constructor(private httpClient: HttpClient) {}

  transform(hero: Hero): string {
    const url: string = `assets/heroes/${hero.id}.jpg`;

    if (!hero.id && !hero.alt_image) return 'assets/no-image.png';
    if (hero.alt_image) return hero.alt_image;
    if (!this.fileExists(url)) return 'assets/no-image.png';

    return url;
  }

  fileExists(url: string): boolean {
    const http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !== 404;
  }
}
