import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header";
import { FooterComponent } from "./components/footer/footer";
import { NotificationComponent } from "./components/notification/notification";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
  ],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class AppComponent {
  title = "E-Commerce Store";
}
