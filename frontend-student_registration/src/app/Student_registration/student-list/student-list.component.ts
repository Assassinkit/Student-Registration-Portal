import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/Models/student.model';
import { StudentService } from 'src/app/Services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent implements OnInit {
  dataSourceTable: MatTableDataSource<Student> = new MatTableDataSource<Student>(); // Initialize dataSourceTable
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'dob',
    'email',
    'gender',
    'phoneNumber',
    'state',
    'city',
    'pincode',
    'actions'
  ];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.fetchStudentData();
  }

  fetchStudentData() {
    this.studentService.getAllStudents().subscribe({
      next: (students: Student[]) => {
        this.dataSourceTable.data = students;
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      },
    });
  }

  // Filter students by name
  applyFilterByName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTable.filter = filterValue.trim().toLowerCase();
  }

  // Filter students by start date
  applyFilterByStartDate(startDate: Date) {
    this.dataSourceTable.filterPredicate = (data: Student, filter: string) => {
      const studentDOB = new Date(data.dob);
      return studentDOB >= startDate;
    };
    this.dataSourceTable.filter = 'custom';
  }

  // Filter students by end date
  applyFilterByEndDate(endDate: Date) {
    this.dataSourceTable.filterPredicate = (data: Student, filter: string) => {
      const studentDOB = new Date(data.dob);
      return studentDOB <= endDate;
    };
    this.dataSourceTable.filter = 'custom';
  }

  deleteStudent(studentId: number) {
    const studentIdStr = studentId.toString();
    // Call the studentService to delete the student with the given ID
    this.studentService.deleteStudent(studentIdStr).subscribe({
      next: () => {
        // Remove the deleted student from the data source
        this.dataSourceTable.data = this.dataSourceTable.data.filter(student => student._id !== studentIdStr);
      },
      error: (error) => {
        console.error('Error deleting student:', error);
      },
    });
  }

}
