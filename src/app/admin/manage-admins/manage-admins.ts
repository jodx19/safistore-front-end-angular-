
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-manage-admins",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./manage-admins.html",
  styleUrls: ["./manage-admins.css"],
})
export class ManageAdminsComponent implements OnInit {
  admins: any[] = [
    {
      id: 1,
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
  ];

  newAdmin = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };

  showForm = false;
  loading = false;
  error = "";
  success = "";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
    }
  }

  addNewAdmin() {
    if (
      !this.newAdmin.email ||
      !this.newAdmin.password ||
      !this.newAdmin.firstName
    ) {
      this.error = "Please fill in all fields";
      return;
    }

    this.loading = true;
    this.error = "";
    this.success = "";

    this.authService
      .addNewAdmin(
        this.newAdmin.email,
        this.newAdmin.password,
        this.newAdmin.firstName,
        this.newAdmin.lastName
      )
      .subscribe((response) => {
        this.loading = false;
        if (response.success) {
          this.success = "New admin added successfully!";
          this.admins.push(response.admin);
          this.newAdmin = {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
          };
          this.showForm = false;
        } else {
          this.error = response.message;
        }
      });
  }

  removeAdmin(email: string) {
    if (confirm("Are you sure you want to remove this admin?")) {
      this.admins = this.admins.filter((a) => a.email !== email);
      this.success = "Admin removed successfully!";
    }
  }
}