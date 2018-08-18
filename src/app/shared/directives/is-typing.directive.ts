import { Directive,  OnInit, HostListener,  } from '@angular/core';
import { Subject,  from } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, switchMap, throttleTime, tap, takeUntil, filter } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';

@Directive({
  selector: '[appIsTyping]'
})
export class IsTypingDirective implements OnInit  {

  private text$ = new Subject<string>();
  private placeId: string;

  constructor(
    private AR: ActivatedRoute,
    private current: UserService,
    private router: Router,
    private chat: ChatService
  ) { }

  ngOnInit() {
    this.AR.queryParamMap
    .pipe(
      map((data) => data.get('placeId')),
      tap((id) =>  this.placeId = id),
      switchMap(() => this.text$),
      throttleTime(2000),
      takeUntil(this.navStart()),
      switchMap((val) => this.updateIstypingStream(this.placeId, val))

  ).subscribe();
  }

  @HostListener('input', ['$event']) typing() {
    this.text$.next(`${this.current.currentuser$.value.displayName} is typing...`);
  }

  @HostListener('blur', ['$event']) blur() {
    this.updateIstypingStream(this.placeId, '');
  }

  private updateIstypingStream(placeId: string, val: string ) {
    return from(this.chat.updateIsTyping(placeId, val ));
  }

  private navStart() {
    return this.router.events
    .pipe(
      filter((event) => event instanceof NavigationStart )
    );
  }

}
