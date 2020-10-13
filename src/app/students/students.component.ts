import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { find, filter, toArray } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  studentsData: any[];
  searchIsOn: boolean;
  isFound: boolean;
  searchName: string;

  constructor(private service: DataService) {
    this.searchIsOn = false;
    this.isFound = true;
    this.searchName = '';
  }

  ngOnInit(): void {
    this.studentsData = this.service.getStudents();
    if (!this.studentsData) {
      this.service.getJSON();
    }
    this.service.getEventData().subscribe((data) => {
      this.studentsData = data;
    });
  }

  search() {
    this.searchIsOn = true;

    this.studentsData = this.service.getStudents();

    let found;
    from(this.studentsData)
      .pipe(find((item) => item.name === this.searchName))
      .subscribe((data) => {
        found = data;
      });

    if (this.searchName === '') {
      this.service.setStudents(this.studentsData);
      this.isFound = true;
      this.searchIsOn = false;
    } else if (this.searchName !== '' && found === undefined) {
      this.isFound = false;
    } else {
      from(this.studentsData)
        .pipe(
          filter((item) => item.name === this.searchName),
          toArray()
        )
        .subscribe((data) => {
          this.studentsData = data;
        });

      this.isFound = true;
    }
    this.searchName = '';
    // console.log(this.service.getStudents());
  }

  back() {
    this.studentsData = this.service.getStudents();
    this.service.setStudents(this.studentsData);
    this.isFound = true;
    this.searchIsOn = false;
  }

  deleteSelected() {
    this.service.deleteSelected();
  }
}
