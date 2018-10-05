import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppMessage } from '../../../models/user.model';
import { delay, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  @Input() messages$: Observable<AppMessage[]>;

  public msgs$:  Observable<AppMessage[]>;

  @ViewChild('bottom') bottom;
  constructor() { }

  ngOnInit() {
    this.msgs$ = this.messages$.pipe(
     tap(() => this.scrollToBottom()),
     tap((msgs) => console.log('the messages ', msgs))
    );
  }

  private scrollToBottom() {
    of(true)
      .pipe(
        delay(500),
        take(1)
      ).subscribe(() => this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }

}
