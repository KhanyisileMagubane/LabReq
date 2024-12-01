import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestService } from './services/test/test.service';
import { Test } from './models/test';
import { HeaderComponent } from './pages/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  tests: Test[] = [];
  constructor(private testService: TestService) {}

  ngOnInit() {
    this.testService.getTests().subscribe((data) => {
      this.tests = data.filter((test) => test.isActive);
      this.testService.setCurrentTest(this.tests);
    });
  }
}
