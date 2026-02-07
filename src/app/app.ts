import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  public employees: Employee[] = [];
  public filteredEmployees: Employee[] = [];
  public isLoading: boolean = false; 

  public editEmployee: Employee | null = null;
  public deleteEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
  this.isLoading = true;

  this.employeeService.getEmployees().subscribe({
    next: (response: Employee[]) => {
      this.employees = response;
      this.filteredEmployees = [...response];
      this.isLoading = false;
    },
    error: (error: HttpErrorResponse) => {
      alert(error.message);
      this.isLoading = false;
    }
  });
}


  public onAddEmloyee(addForm: any): void {
    document.getElementById('add-employee-form')?.click();

    this.employeeService.addEmployee(addForm.value).subscribe({
      next: () => {
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  public onUpdateEmloyee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: () => this.getEmployees(),
      error: (error: HttpErrorResponse) => alert(error.message)
    });
  }

  // ✅ SAFE delete (no undefined possible)
  public onDeleteEmployee(employeeId: number): void {
  this.employeeService.deleteEmployee(employeeId).subscribe({
    next: () => {
      this.getEmployees();
    },
    error: (error) => {
      alert(error.message);
    }
  });
}

 public searchEmployees(key: string | null | undefined): void {

  // 🔴 IMPORTANT FIX
  if (!key || key.trim() === '') {
    this.filteredEmployees = [...this.employees];
    return;
  }

  const lowerKey = key.toLowerCase();

  this.filteredEmployees = this.employees.filter(employee =>
    employee.name.toLowerCase().includes(lowerKey) ||
    employee.email.toLowerCase().includes(lowerKey) ||
    employee.phone.toLowerCase().includes(lowerKey) ||
    employee.jobTitle.toLowerCase().includes(lowerKey)
  );
}



  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }

    if (mode === 'edit' && employee) {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }

    if (mode === 'delete' && employee) {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}




