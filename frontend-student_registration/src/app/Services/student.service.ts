
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../Models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  // Get Url
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Fetch all students
  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  updateStudent(student: Student): Observable<Student> {
    // Implement the method to update the student in the backend
    return this.http.put<Student>(`${this.baseUrl}/students/${student.firstName}`, student);
  }

  // Delete a student by ID
  deleteStudent(studentId: string): Observable<Student> {
    return this.http.delete<Student>(`${this.baseUrl}/students/${studentId}`); //(Edited after submission)
  }

}
