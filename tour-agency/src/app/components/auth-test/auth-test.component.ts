import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-test',
  templateUrl: './auth-test.component.html',
  styleUrls: ['./auth-test.component.scss']
})
export class AuthTestComponent implements OnInit {
  interceptorResponse: string = '';
  explicitHeadersResponse: string = '';
  publicEndpointResponse: string = '';
  currentToken: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private testService: TestService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentToken = this.testService.getToken();
  }

  testInterceptor(): void {
    this.interceptorResponse = 'Testing...';
    this.testService.testAuthWithInterceptor().subscribe(
      response => {
        this.interceptorResponse = JSON.stringify(response, null, 2);
      },
      error => {
        this.interceptorResponse = `Error: ${error.status} - ${error.message}`;
        console.error('Interceptor test error:', error);
      }
    );
  }

  testExplicitHeaders(): void {
    this.explicitHeadersResponse = 'Testing...';
    this.testService.testAuthWithExplicitHeaders().subscribe(
      response => {
        this.explicitHeadersResponse = JSON.stringify(response, null, 2);
      },
      error => {
        this.explicitHeadersResponse = `Error: ${error.status} - ${error.message}`;
        console.error('Explicit headers test error:', error);
      }
    );
  }

  testPublicEndpoint(): void {
    this.publicEndpointResponse = 'Testing...';
    this.testService.testPublicEndpoint().subscribe(
      response => {
        this.publicEndpointResponse = JSON.stringify(response, null, 2);
      },
      error => {
        this.publicEndpointResponse = `Error: ${error.status} - ${error.message}`;
        console.error('Public endpoint test error:', error);
      }
    );
  }
}
