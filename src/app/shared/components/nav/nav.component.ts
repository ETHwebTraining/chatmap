import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  // used to let the parent component know when the button has been clicked
  @Output() toggleNav = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

}
