import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Hero } from './hero.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EndpointsType, ENDPOINTS_CONFIG } from 'src/app/configs/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient,
    @Inject(ENDPOINTS_CONFIG) private endpoints: EndpointsType
  ) {}

  searchHeroes(): Observable<Hero[]> {
    return this.http
      .get(this.endpoints.searchHeroes)
      .pipe(
        map((result: any) => result.data.searchHeroes.edges.map((edge: any) => new Hero(edge.node)))
      );
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http
      .get(this.endpoints.getHeroById, { params: new HttpParams({ fromObject: { id } }) })
      .pipe(map((result: any) => new Hero(result.data.hero)));
  }

  createHero(hero: Hero) {
    return this.http.post(this.endpoints.createHero, { hero }).pipe(
      map((response: any) => {
        return !response.errors ? response.data.createHero : response;
      })
    );
  }

  voteHero(hero: Hero) {
    return this.http.post(this.endpoints.voteHero, { hero }).pipe(
      map((response: any) => {
        return !response.errors ? response.data.voteHero : response;
      })
    );
  }

  removeHero(id: string) {
    return this.http
      .delete(this.endpoints.removeHero, { params: new HttpParams({ fromObject: { id } }) })
      .pipe(
        map((response: any) => {
          return !response.errors ? {} : response;
        })
      );
  }
}
