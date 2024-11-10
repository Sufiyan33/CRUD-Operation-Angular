import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';
import { Constants } from './constant/Constant';
import { max, min } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[]=[];
  validationMessage: any = Constants.VALIDATION_MESSAGE;

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
      name: new FormControl(this.employeeObj.name, [Validators.required, Validators.pattern('^[a-zA-z]+$') ,Validators.maxLength(15)]),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId, [Validators.required, Validators.email]),
      contactNo: new FormControl(this.employeeObj.contactNo, [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      address: new FormControl(this.employeeObj.address),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6), Validators.pattern('^[0-9]+$')])
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
    //debugger;
    const oldData = localStorage.getItem("empData");
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    }else{
      this.employeeList.unshift(this.employeeForm.value);
    }
    localStorage.setItem("empData", JSON.stringify(this.employeeList))
    this.onReset();
  }

  onReset(){
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  onEdit(item: EmployeeModel){
    this.employeeObj = item;
    this.createForm();
  }

  /*
    Now, to delete first find index and use splice method to delete that particular index.
  */
  onDelete(id: number){
    const isDelete = confirm('Are you sure, you want to delete?')
    if(isDelete){
      const index =  this.employeeList.findIndex(m => m.empId == id);
      this.employeeList.splice(index, 1);
      localStorage.setItem('empData', JSON.stringify(this.employeeList));
    }
  }

  onUpdate(){
    //debugger;
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if(record != undefined){
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
    }
    localStorage.setItem('empData', JSON.stringify(this.employeeList));
    this.onReset();
  }
}
