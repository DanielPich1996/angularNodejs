import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private aboutService: AboutService) { }
  
  branches = [];

  ngOnInit() {
    this.aboutService.getBranches().subscribe(res => {
      this.branches = res.slice();
    }, err => {
      alert('Cannot get branches from server')
    });
  }
}
