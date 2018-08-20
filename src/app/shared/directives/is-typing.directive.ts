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

  private text$ = new Subject<string>(); // used to multi cast new values
  private placeId: string;

  constructor(
    private AR: ActivatedRoute,
    private current: UserService,
    private router: Router,
    private chat: ChatService
  ) { }

  ngOnInit() {

    /*
      getting the place id from the url then switching to the text stream
      throttling it for values within a 2 second window then updationg the
      is typing property on the document. the stream completes once we start navigating
      else where
    */

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

  // listens for when the user is typing and then nexts the string to be updated in the db
  @HostListener('input', ['$event']) typing() {
    this.text$.next(`${this.current.currentuser$.value.displayName} is typing...`);
  }

  // listens for when the user leaves the input, then updates the value in the db with an empty string
  @HostListener('blur', ['$event']) blur() {
    this.updateIstypingStream(this.placeId, '');
  }

  // updates the is typing property for the place in the db
  private updateIstypingStream(placeId: string, val: string ) {
    return from(this.chat.updateIsTyping(placeId, val ));
  }

  // returns an observable of navigation start event
  private navStart() {
    return this.router.events
    .pipe(
      filter((event) => event instanceof NavigationStart )
    );
  }

}
