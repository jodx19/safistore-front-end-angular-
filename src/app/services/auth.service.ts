import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";

export interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // hashed in-memory (demo only)
  role?: "user" | "admin";
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  private tokenKey = "auth_token";

  // demo users (passwords stored as "hashed" via hashPassword)
  private users: User[] = [
    {
      id: 1,
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      password: this.hashPassword("admin123"),
      role: "admin",
    },
    {
      id: 2,
      email: "user@example.com",
      firstName: "User",
      lastName: "Test",
      password: this.hashPassword("user123"),
      role: "user",
    },
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  // -------------------------
  // Password Hashing
  // -------------------------
  /**
   * Hash password using base64 encoding (DEMO ONLY)
   * 
   * ⚠️ SECURITY NOTE: In production, password hashing MUST be done on the backend server
   * using proper cryptographic hashing algorithms (bcrypt, argon2, scrypt, etc.).
   * 
   * This implementation is for demo purposes only and should NEVER be used in production.
   * 
   * @param password - Plain text password
   * @returns Base64 encoded password (NOT secure)
   */
  private hashPassword(password: string): string {
    try {
      return btoa(password);
    } catch {
      return password; // fallback for non-browser env (rare)
    }
  }

  private comparePassword(inputPassword: string, hashedPassword: string): boolean {
    return this.hashPassword(inputPassword) === (hashedPassword || "");
  }

  // -------------------------
  // Token generation & validation
  // - New format: base64(JSON.stringify({ email, ts, role }))
  // - Backwards-compatible with old "email:timestamp:role" format
  // -------------------------
  private generateToken(user: User): string {
    const payload = { email: user.email, ts: Date.now(), role: user.role || "user" };
    try {
      return btoa(JSON.stringify(payload));
    } catch {
      // fallback legacy (shouldn't normally be needed)
      return btoa(`${user.email}:${Date.now()}:${user.role || "user"}`);
    }
  }

  private parseToken(token: string): { email?: string; ts?: number; role?: string } | null {
    try {
      const decoded = atob(token);
      // try JSON format first
      try {
        const obj = JSON.parse(decoded);
        if (obj && obj.email && obj.ts) return { email: obj.email, ts: Number(obj.ts), role: obj.role };
      } catch {
        // fallback to legacy "email:timestamp:role"
        const parts = decoded.split(":");
        if (parts.length >= 2) {
          const email = parts[0];
          const ts = parseInt(parts[1], 10);
          const role = parts[2] || "user";
          if (!Number.isNaN(ts)) return { email, ts, role };
        }
      }
    } catch {
      // invalid base64
    }
    return null;
  }

  private validateToken(token: string): boolean {
    const parsed = this.parseToken(token);
    if (!parsed || !parsed.ts) return false;
    const tokenTime = Number(parsed.ts);
    if (Number.isNaN(tokenTime)) return false;
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return currentTime - tokenTime < oneDay; // token valid for 24h in demo
  }

  // -------------------------
  // Public API (register / login / logout)
  // -------------------------
  register(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    try {
      if (!email || !password || !firstName || !lastName) {
        return of({ success: false, message: "All fields are required" });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return of({ success: false, message: "Invalid email format" });
      }

      if (password.length < 6) {
        return of({ success: false, message: "Password must be at least 6 characters" });
      }

      const userExists = this.users.some((u) => u.email === email);
      if (userExists) {
        return of({ success: false, message: "Email already registered" });
      }

      const newUser: User = {
        id: this.users.length + 1,
        email,
        firstName,
        lastName,
        password: this.hashPassword(password),
        role: "user",
      };

      this.users.push(newUser);

      const token = this.generateToken(newUser);
      // push current user WITHOUT password for safety
      const publicUser = { ...newUser, password: undefined };
      this.currentUser.next(publicUser as User);
      localStorage.setItem(this.tokenKey, token);

      return of({
        success: true,
        message: "Registration successful",
        token,
        user: publicUser,
      });
    } catch (error) {
      return throwError(() => new Error("Registration failed"));
    }
  }

  login(email: string, password: string, role?: "user" | "admin"): Observable<any> {
    try {
      if (!email || !password) {
        return of({ success: false, message: "Email and password are required" });
      }

      const user = this.users.find((u) => u.email === email);

      if (!user || !this.comparePassword(password, user.password || "")) {
        return of({ success: false, message: "Invalid email or password" });
      }

      if (role && user.role !== role) {
        return of({ success: false, message: `This account is not registered as ${role}` });
      }

      const token = this.generateToken(user);
      const publicUser = { ...user, password: undefined };
      this.currentUser.next(publicUser as User);
      localStorage.setItem(this.tokenKey, token);

      return of({
        success: true,
        message: "Login successful",
        token,
        user: publicUser,
      });
    } catch (error) {
      return throwError(() => new Error("Login failed"));
    }
  }

  logout(): void {
    this.currentUser.next(null);
    localStorage.removeItem(this.tokenKey);
  }

  // -------------------------
  // Helpers & getters
  // -------------------------
  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  // keep the existing method name used across the project
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.validateToken(token) : false;
  }

  // alias for projects that call isLoggedIn()
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // JWT-style methods for interceptor compatibility
  getAccessToken(): string | null {
    return this.getToken();
  }

  getRefreshToken(): string | null {
    // For demo purposes, return the same token as refresh token
    return this.getToken();
  }

  refreshToken(refreshToken: string): Observable<any> {
    // For demo purposes, just validate and return the same token
    if (this.validateToken(refreshToken)) {
      return of({
        accessToken: refreshToken,
        refreshToken: refreshToken
      });
    } else {
      return throwError(() => new Error('Invalid refresh token'));
    }
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // -------------------------
  // Admin helpers (demo stubs)
  // -------------------------
  addNewAdmin(email: string, password: string, firstName: string, lastName: string): Observable<any> {
    try {
      const currentUser = this.getCurrentUser();

      if (currentUser?.role !== "admin") {
        return of({ success: false, message: "Only admins can add new admins" });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return of({ success: false, message: "Invalid email format" });
      }

      const userExists = this.users.some((u) => u.email === email);
      if (userExists) {
        return of({ success: false, message: "Email already exists" });
      }

      const newAdmin: User = {
        id: this.users.length + 1,
        email,
        firstName,
        lastName,
        password: this.hashPassword(password),
        role: "admin",
      };

      this.users.push(newAdmin);
      return of({ success: true, message: "New admin added successfully", admin: { ...newAdmin, password: undefined } });
    } catch (error) {
      return throwError(() => new Error("Failed to add admin"));
    }
  }

  // -------------------------
  // On app start: restore user from token (if valid)
  // -------------------------
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return;

    if (!this.validateToken(token)) {
      localStorage.removeItem(this.tokenKey);
      this.currentUser.next(null);
      return;
    }

    const parsed = this.parseToken(token);
    if (!parsed || !parsed.email) {
      this.currentUser.next(null);
      return;
    }

    // find user from the in-memory users list (demo)
    const found = this.users.find((u) => u.email === parsed.email);
    if (found) {
      const publicUser = { ...found, password: undefined };
      this.currentUser.next(publicUser as User);
    } else {
      // user not found in demo DB — create a minimal public user entry
      const publicUser = { email: parsed.email, firstName: parsed.email.split("@")[0], lastName: "" } as User;
      this.currentUser.next(publicUser);
    }
  }
}
