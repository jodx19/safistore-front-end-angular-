
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
  admins: any[] = [];

  newAdmin = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };

  showForm = false;
  loading = false;
  error = "";
  success = "";

  constructor(private authService: AuthService, private router: Router) { }

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

    // TODO: Implement a dedicated admin-creation API endpoint.
    // addNewAdmin() is currently a deprecated stub — see AuthService.
    this.loading = false;
    this.error = 'Admin creation via this panel is not yet implemented. Please use the backend admin CLI or a secure invitation flow.';
  }

  removeAdmin(email: string) {
    if (confirm("Are you sure you want to remove this admin?")) {
      this.admins = this.admins.filter((a) => a.email !== email);
      this.success = "Admin removed successfully!";
    }
  }
}