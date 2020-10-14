import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { filter, map, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private url = 'https://my-json-server.typicode.com/delfiaghosh11/db/students';
  private students: any[];
  private deletedStudents = new Array();
  private event = new EventEmitter();
  private deleteEvent = new EventEmitter();
  private selectedStudents = new Array();

  constructor(private http: HttpClient) {}

  getJSON(): any {
    return this.http.get(this.url).subscribe((data) => {
      this.setStudents(data);
    });
  }

  getStudents() {
    return this.students;
  }

  setStudents(sArray) {
    this.students = sArray;
    this.event.emit(this.students);
  }

  getDeletedStudents() {
    return this.deletedStudents;
  }

  setDeletedStudents(dArray) {
    this.deletedStudents = dArray;
    this.deleteEvent.emit(this.deletedStudents);
  }

  getEventData() {
    return this.event;
  }

  getDeletedEventData() {
    return this.deleteEvent;
  }

  addStudent(newStudent: Object) {
    this.students.push(newStudent);
    this.setStudents(this.students);
  }

  updateStudent = (
    roll,
    name,
    city,
    college,
    qualification,
    gender,
    isCompleted
  ) => {
    from(this.getStudents())
      .pipe(
        map((item) =>
          item.roll === roll
            ? ((item.name = name),
              (item.city = city),
              (item.college = college),
              (item.qualification = qualification),
              (item.gender = gender),
              (item.isCompleted = isCompleted))
            : item
        ),
        toArray()
      )
      .subscribe((data) => {
        // console.log(data);
      });
  };

  deleteStudent(index, student) {
    this.deletedStudents.push(student);
    this.deletedStudents = this.deletedStudents.sort((a, b) => a.roll - b.roll);
    this.setDeletedStudents(this.deletedStudents);

    this.students.splice(index, 1);
    this.setStudents(this.students);
  }

  undoDelete(index, item) {
    this.students.push(item);
    this.students = this.students.sort((a, b) => a.roll - b.roll);
    this.setStudents(this.students);

    this.deletedStudents.splice(index, 1);
    this.setDeletedStudents(this.deletedStudents);
  }

  deleteSelected() {
    from(this.getStudents())
      .pipe(
        filter((item) => item.isCompleted === true),
        toArray()
      )
      .subscribe((data) => (this.selectedStudents = data));

    if (this.selectedStudents.length > 0) {
      from(this.students)
        .pipe(
          filter((item) => item.isCompleted === false),
          toArray()
        )
        .subscribe((data) => {
          this.students = data;
          this.setStudents(this.students);
        });

      from(this.selectedStudents)
        .pipe(map((item) => this.deletedStudents.push(item)))
        .subscribe();

      this.deletedStudents = this.deletedStudents.sort(
        (a, b) => a.roll - b.roll
      );
      this.setDeletedStudents(this.deletedStudents);
    } else {
      alert('Please select at least one item to delete.');
    }
  }

  undoSelectedDeletes() {
    from(this.getDeletedStudents())
      .pipe(
        filter((item) => item.isCompleted === true),
        toArray()
      )
      .subscribe((data) => (this.selectedStudents = data));

    if (this.selectedStudents.length > 0) {
      from(this.deletedStudents)
        .pipe(
          filter((item) => item.isCompleted === false),
          toArray()
        )
        .subscribe((data) => {
          this.deletedStudents = data;
          this.setDeletedStudents(this.deletedStudents);
        });

      from(this.selectedStudents)
        .pipe(map((item) => this.students.push(item)))
        .subscribe();

      this.students = this.students.sort((a, b) => a.roll - b.roll);
      this.setStudents(this.students);
    } else {
      alert('Please select at least one item to undo delete.');
    }
  }
}
