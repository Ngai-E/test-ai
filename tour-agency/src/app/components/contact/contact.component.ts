import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.contactData);
    // Here you would typically send the data to your backend
    this.contactData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
