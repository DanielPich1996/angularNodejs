import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { WebsoketService } from '../shared/websoket.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  usersCount: number;
  wsSubscription: Subscription;
  status;
  userId = null
  constructor(private authService: AuthService,
              private router: Router,
              private wsService: WebsoketService){
                
    this.wsSubscription = this.wsService.createObservableSocket("ws://localhost:8085").subscribe(data => {
      this.usersCount = +data;
    },
      err => console.log( 'err'),
      () =>  console.log( 'The observable stream is complete')
    );
  }
  
  ngOnInit(){
    this.userId = this.authService.getUserId();

    this.authService.userCanged.subscribe(id =>{
      this.userId = id;
    });
  }

  onLogOut(){
    this.authService.logOut();
    this.router.navigate(['/auth']);
  }

  // sendMessageToServer(){
  //   this.status = this.wsService.sendMessage("Hello from client");
  //  }

  closeSocket(){
    this.wsSubscription.unsubscribe();
     this.status = 'The socket is closed';
  }

  ngOnDestroy() {
    this.closeSocket();
  }
}
