
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";
import { AdminLayoutComponent } from "../admin-layout/admin-layout";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-manage-admins",
  standalone: true,
  imports: [CommonModule, FormsModule, AdminLayoutComponent],
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

  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(["/products"]);
    }
    this.loadAdmins();
  }

  loadAdmins() {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}/users`).subscribe({
      next: (response) => {
        const payload = response?.data;
        this.admins = (payload?.users || []).filter((u: any) => u.role === 'Admin');
        this.loading = false;
      },
      error: () => {
        this.error = "Failed to load admins";
        this.loading = false;
      }
    });
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

    this.http.post<any>(`${this.apiUrl}/users`, {
      firstName: this.newAdmin.firstName,
      lastName: this.newAdmin.lastName || '-',
      email: this.newAdmin.email,
      password: this.newAdmin.password
    }).subscribe({
      next: (response) => {
        if (response?.success) {
          this.success = "Admin created successfully!";
          this.showForm = false;
          this.newAdmin = { email: '', firstName: '', lastName: '', password: '' };
          this.loadAdmins();
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.error?.message || "Failed to create admin";
        this.loading = false;
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