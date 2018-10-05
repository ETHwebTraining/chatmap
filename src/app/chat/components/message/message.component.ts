import { Component, OnInit, Input } from '@angular/core';
import { AppMessage } from '../../../models/user.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message: AppMessage;

  constructor() { }

  ngOnInit() {
  }

}
