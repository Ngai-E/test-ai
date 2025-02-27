import { Component, OnInit } from '@angular/core';
import { PackageService, Package } from '../../services/package.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  packages: Package[] = [];

  constructor(private packageService: PackageService) { }

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packageService.getAllPackages().subscribe(
      packages => this.packages = packages,
      error => console.error('Error loading packages:', error)
    );
  }
}
