import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import { ToastService } from '../../services/toast.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLogin?: Date;
}

interface UserFilters {
  search: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('userDetailsModal') userDetailsModal!: TemplateRef<any>;
  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;

  users: User[] = [];
  filteredUsers: User[] = [];
  
  loading = true;
  error = false;
  
  selectedUser: User | null = null;
  actionType: string = '';
  
  roleOptions = ['User', 'Admin'];
  statusOptions = ['Active', 'Inactive'];
  
  filters: UserFilters = {
    search: '',
    role: '',
    status: ''
  };

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        this.error = true;
        this.loading = false;
      }
    );
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      // Search filter (case insensitive)
      const searchMatch = !this.filters.search || 
        user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filters.search.toLowerCase()) ||
        user.id.toString().includes(this.filters.search);
      
      // Role filter
      const roleMatch = !this.filters.role || 
        user.role === this.filters.role;
      
      // Status filter
      const statusMatch = !this.filters.status || 
        user.status === this.filters.status;
      
      return searchMatch && roleMatch && statusMatch;
    });
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.modalService.open(this.userDetailsModal, { size: 'lg', centered: true });
  }

  confirmAction(user: User, action: string): void {
    this.selectedUser = user;
    this.actionType = action;
    this.modalService.open(this.confirmModal, { centered: true });
  }

  executeAction(): void {
    if (!this.selectedUser) {
      return;
    }
    
    switch (this.actionType) {
      case 'makeAdmin':
        this.updateUserRole(this.selectedUser, 'Admin');
        break;
      case 'removeAdmin':
        this.updateUserRole(this.selectedUser, 'User');
        break;
      case 'activate':
        this.activateUser(this.selectedUser);
        break;
      case 'deactivate':
        this.deactivateUser(this.selectedUser);
        break;
      default:
        break;
    }
    
    this.modalService.dismissAll();
  }

  updateUserRole(user: User, role: string): void {
    this.adminService.updateUserRole(user.id, role).subscribe(
      () => {
        user.role = role;
        this.toastService.showSuccess(`User ${user.name}'s role updated to ${role}`);
      },
      (error) => {
        console.error('Error updating user role:', error);
        this.toastService.showError('Failed to update user role');
      }
    );
  }

  activateUser(user: User): void {
    this.adminService.activateUser(user.id).subscribe(
      () => {
        user.status = 'Active';
        this.toastService.showSuccess(`User ${user.name} has been activated`);
      },
      (error) => {
        console.error('Error activating user:', error);
        this.toastService.showError('Failed to activate user');
      }
    );
  }

  deactivateUser(user: User): void {
    this.adminService.deactivateUser(user.id).subscribe(
      () => {
        user.status = 'Inactive';
        this.toastService.showSuccess(`User ${user.name} has been deactivated`);
      },
      (error) => {
        console.error('Error deactivating user:', error);
        this.toastService.showError('Failed to deactivate user');
      }
    );
  }

  getRoleClass(role: string): string {
    return role === 'Admin' ? 'bg-primary' : 'bg-info';
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'bg-success' : 'bg-danger';
  }
}
