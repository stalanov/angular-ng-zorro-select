import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nz-demo-select-big-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]=form>
    <nz-select
      nzMode="multiple"
      nzPlaceHolder="Please select"
      [nzOptions]="listOfOption"
      [(ngModel)]="listOfSelectedValue"
      formControlName="list"
    ></nz-select>
  </form>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `,
  ],
})
export class NzDemoSelectBigDataComponent implements OnInit {
  form: FormGroup;
  listOfOption: Array<{ value: string; label: string }> = [];
  listOfSelectedValue = ['a10', 'c12'];

  ngOnInit(): void {
    this.form = new FormGroup({
      list: new FormControl(),
    });
    this.form.controls.list.valueChanges.subscribe((val) => console.log(val));
    const children: string[] = [];
    for (let i = 10; i < 10000; i++) {
      children.push(`${i.toString(36)}${i}`);
    }
    this.listOfOption = children.map((item) => ({
      value: item,
      label: item,
    }));
  }
}
