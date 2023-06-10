import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
})
export class DefaultComponent implements OnInit {
  @ViewChild('loginModal') loginModal: any;

  ngOnInit(): void {}

  handleLoginSuccess() {
    this.loginModal.hide();
  }
}
