import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-admin-sign-in',
  templateUrl: './admin-sign-in.component.html',
  styleUrls: ['./admin-sign-in.component.css']
})
export class AdminSignInComponent implements OnInit{
  adminForm!: FormGroup;
  username: string = '';
  password: string = '';

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<AdminSignInComponent>
    ) { }

  ngOnInit(): void {

  }

  createAdminForm () {
    this.adminForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),

    })

 }
  onCancelClick(): void {
    // Close the dialog box
    this.dialogRef.close();
  }

  onSignInClick(): void {
    // Validate the entered username and password
    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'admin123';

    if (this.username === hardcodedUsername && this.password === hardcodedPassword) {
      this.dialogRef.close({ success: true });

      // Navigate to the StudentListComponent upon successful sign-in
      this.router.navigate(['/student-list']);

    } else {
      this.dialogRef.close({ success: false });
    }
  }


}
