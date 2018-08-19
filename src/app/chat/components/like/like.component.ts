import { ChatService } from './../../../services/chat.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.scss']
})
export class LikeComponent implements OnInit {

  public isLiked$: Observable<boolean>;
  private placeId$: Observable<string>;

  constructor(
    private chat: ChatService,
    private AR: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.placeId$ = this.AR.queryParamMap.pipe(
      map((data) => data.get('placeId'))
    );

    this.isLiked$ = this.placeId$.pipe(
      switchMap((id) => this.chat.getIsLiked(id)),
      take(1),
      map((res) => !!res && !!Object.keys(res).length),
    );
  }

  public onUnlike() {
    this.isLiked$ = of(false);
    this.placeId$.pipe(
      switchMap((id) => this.chat.unLikePlace(id)),
      take(1)
    ).subscribe();
  }

  public onLike() {
    this.isLiked$ = of(true);
    this.placeId$.pipe(
      switchMap((id) => this.chat.likePlace(id)),
      take(1)
    ).subscribe();
  }

}
