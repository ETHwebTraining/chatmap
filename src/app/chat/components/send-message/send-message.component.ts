import { AppMessage } from './../../../models/user.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../../../models/user.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  public text: FormControl;

  @Input() user: UserProfile;
  @Input() isTyping$: Observable<string>;
  @Output() msg = new EventEmitter<AppMessage>();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.text = this.fb.control('', [Validators.required]);
  }

  public onSend() {
    const message: AppMessage = {
      displayName: this.user.displayName,
      content: this.text.value,
      userId: this.user.id,
      photoURL: this.user.photoURL
      };
      this.msg.emit(message);
      this.text.setValue('');
  }

}
