import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { of, Subscription } from 'rxjs';
import { debounceTime, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'nz-demo-select-big-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]=form>
    <nz-select
      nzMode="multiple"
      nzPlaceHolder="Please select"
      [nzOptions]="listOfOption"
      formControlName="list"
    ></nz-select>
  </form>
  `,
  styles: [
    `
      nz-select {
        padding: 16px;
        width: 100%;
      }
    `,
  ],
})
export class NzDemoSelectBigDataComponent implements OnInit, OnDestroy {
  @ViewChild(NzSelectComponent) select: NzSelectComponent;
  form: FormGroup;
  listOfOption: Array<{ value: string; label: string }> = [];
  formSub: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // это просто мок метода пост чтобы не происходил реальный запрос
    this.http.post = (url: string, data) => of(data);

    this.form = new FormGroup({
      list: new FormControl(),
    });
    this.formSub = this.form.controls.list.valueChanges
      .pipe(
        debounceTime(2000),
        tap(() => {
          this.select.blur();
          this.select.setOpenState(false);
        }),
        mergeMap((data) => this.http.post('url', data))
      )
      .subscribe((data) => console.log('выполнено сохранение ', data));

    this.createItems();
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  private createItems(): void {
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
