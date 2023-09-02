import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminSignInComponent } from '../admin-sign-in/admin-sign-in.component';
// import { StudentService } from 'src/app/Services/student.service';
// import { Student } from 'src/app/Models/student.model';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  // For Creating Form
  registrationForm!: FormGroup;
  Genders = ['Male', 'Female', 'Others'];

  // For States
  states: string[] = ['Gujarat', 'Karnataka', 'Madhya Pradesh', 'Tamil Nadu','Uttar Pradesh', ];
  // For Cities with corresponding States
  cities: { [state: string]: string[] } = {
    'Gujarat': ['Ahmedabad', 'Daman', 'Diu', 'Kuchh', 'Surat', 'Junagadh'],
    'Karnataka': ['Bangalore', 'Coorg', 'Mangalore'],
    'Madhya Pradesh': ['Bhopal', 'Jabalpur', 'Rewa', 'Singrauli', 'Waidhan'],
    'Tamil Nadu': ['Chennai', 'Vellore', 'Selum'],
    'Uttar Pradesh': ["Agra", "Allahabad","Asansol", 'Renukoot', 'Varanasi']
  };

  // For Profile Image
  imageUrl: string = '';
  fileToUpload: File | null = null;

  // On submitting the Registration Form
  formData: any = {};

  private formSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createStudentRegistrationForm();
  }

  createStudentRegistrationForm() {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        dob: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        gender: new FormControl(null, [Validators.required]),
        // phoneNumber: new FormControl(null, [Validators.required]),
        phoneNumber: new FormControl(null, [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^\d{0,10}$/), // Regular expression for 10-digit phone number
        ]),
        state: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        pincode: new FormControl(null, [
          Validators.required,
          Validators.maxLength(6),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(8),
        ]),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.maxLength(8),
        ]),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Validation for matching both Password and Confirm password
  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // For Profile Image
  handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];
      this.fileToUpload = selectedFile;

      // Show Image Preview
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
    }
  }

//  On Submitting the Registration Form
  onSubmit() {
    if (this.registrationForm.valid) {
      // console.log(this.registrationForm.value);

      const formValues = this.registrationForm.value;
      const imageInput: HTMLInputElement | null = document.querySelector(
        'input[type="file"][name="profileImage"]'
      );
      const imageFileName =
        imageInput?.files && imageInput.files.length > 0 ? imageInput.files[0].name: 'No image selected';

      this.formData = {
        ...formValues,
        profileImage: imageFileName,
      };

      console.log(this.formData);

      // Sending formData to the backend
      this.http.post('http://localhost:3000/api/register', this.formData).subscribe(
        (response: any) => {
          console.log('Form data sent to the backend:', response);
          if (response && response.success) {
            // this.router.navigate(['/student-list']);
            this.navigateToAdminSignIn();
            // this.snackBar.open('Registered Successfully!', 'Close', {
            //   duration: 3000,
            // });

          } else {
            if (response && response.error) {
              // Assuming the backend returns an error message in the error field
              console.error('Registration failed:', response.error);
              this.snackBar.open(response.error, 'Close', {
                duration: 5000,
              });
            } else {
              console.error('Registration failed: Unknown error');
              this.snackBar.open('Registration failed. Please try again later.', 'Close', {
                duration: 5000,
              });
            }
          }
        },
        (error) => {
          console.error('Error sending form data to the backend:', error);
          this.snackBar.open('Error sending form data to the server. Please try again later.', 'Close', {
            duration: 5000,
          });
        }
      );
    }
  }


  // Navigate to Admin Sign-in page
  navigateToAdminSignIn() {
    const dialogRef = this.dialog.open(AdminSignInComponent, {
      width: '400px', // You can adjust the width as per your requirement
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.success) {
        this.router.navigate(['/student-list']);
      } else {
        console.log('Incorrect username or password.');
      }
    });
  }
}
