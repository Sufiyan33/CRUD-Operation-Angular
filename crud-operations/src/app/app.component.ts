import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EmployeeModel } from './model/Employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[]=[];

  constructor(){
    this.createForm();
    //debugger;
    const oldData = localStorage.getItem("empData");
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }
  //Now create control for all fields
  createForm(){
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId),
      contactNo: new FormControl(this.employeeObj.contactNo),
      address: new FormControl(this.employeeObj.address),
      pinCode: new FormControl(this.employeeObj.pinCode)
    })
  }
  // Now let's bind this form to html fileds.

  //Now let's add CRUD function for saving and removing employee
  /*
  Since we want empId auto generated, for that we need to check if local storage length
  if there are data then increase by 1.

  if page reload then local storage should be check auto, and also need to push data into local storage
   for that you need to add some code in constructor.
  */
  onSave(){
    debugger;
    const oldData = localStorage.getItem("empData");
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    }else{
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("empData", JSON.stringify(this.employeeList))
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  onReset(){

  }

  onEdit(item: EmployeeModel){
    this.employeeObj = item;
    this.createForm();
  }

  onDelete(item: EmployeeModel){
    //item = null;
  }

  onUpdate(){
    debugger;
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if(record != undefined){
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    localStorage.setItem('empData', JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }
}
