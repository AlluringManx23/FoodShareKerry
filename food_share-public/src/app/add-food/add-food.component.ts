import { Component, Input } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css'],
})
export class AddFoodComponent{
  
  constructor() { }
  
  @Input()
  name:string;
  @Input()
  placeholder:string;
  @Input()
  id:string;
  @Input()
  type:string;
  @Input()
  required:string;

  ValidationControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();
    
}
