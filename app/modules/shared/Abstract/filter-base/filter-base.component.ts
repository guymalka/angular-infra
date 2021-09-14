import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ParamMap } from '@angular/router/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pick, pickBy } from 'lodash';
import { AppInjector } from 'projects/RishuiBniyaClient/src/app/GlobalServices/injector.service';
import { Observable } from 'rxjs';
import { delay, distinctUntilChanged, shareReplay } from 'rxjs/operators';

// export type formMap = {[key:string]: 'string' | 'number' | 'date' | 'boolean' };
/**
 * base component to hold common functionality / events
 */

@UntilDestroy()
@Component({ template: '' },)
export class FilterBaseComponent<T> implements OnInit {
  // formMap: formMap;
  /**
   * injected in derived class
   * name have to be the same in definition
   */
  public router: Router;
  /**
  * injected in derived class
  * name have to be the same in definition
  */
  public route: ActivatedRoute
  public form: FormGroup;
  public hasChanges: boolean;
  public openCompoundSearch: boolean;
  public fields: T;
  public queryParams$: Observable<ParamMap>;
  public urlParams: any;

  removeFilter() {

    this.form.reset();
    this.hasChanges = false;
  }

  initiateData(): T {

    this.fields = {} as T;
    return this.fields;
  }

  private getParamsUnderForm() {
    const formFields = Object.keys(this.form.value);
    return pick({ ...this.route.snapshot.queryParams }, formFields);
  }

  ngOnInit(): void {

    const injector = AppInjector.getInjector();
    this.route = injector.get(ActivatedRoute);
    this.router = injector.get(Router);

    this.queryParams$ = this.route.queryParamMap;
    this.queryParams$.pipe(
      untilDestroyed(this),
      delay(0)
    )
      .subscribe(data => {
        // different
        this.urlParams = this.getParamsUnderForm();

        for (let [key, value] of Object.entries<string>(this.urlParams)) {
          let finalValue: any = value;
          if (value.includes('|')) {
            let type: string;
            [value, type] = value.split('|');
            switch (type) {
              case 'd':
                finalValue = new Date(value); // The 0 there is the key, which sets the date to the epoch
                break;
              case 'n':
                finalValue = +value;
                break;
            }
          }
          if (this.form.get(key)?.value !== finalValue)
            this.form.patchValue({ [key]: finalValue });
        }
      });



    this.form.valueChanges.pipe(
      untilDestroyed(this),
      distinctUntilChanged((x, y) => {
        return JSON.stringify(x) === JSON.stringify(y);
      }),
      shareReplay()
    ).subscribe(fields => {

      //console.log('value change' + fields)
      for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
          let value = fields[key];
          if (!value) {
            delete this.urlParams[key];
          } else if (value instanceof Date) {
            this.urlParams[key] = `${value.toDateString()}|d`
          } else if (typeof value === 'number') {
            this.urlParams[key] = `${value}|n`;
          } else {
            this.urlParams[key] = value;
          }
        }
      }

      const navExtras: NavigationExtras = { queryParams: this.urlParams };
      const check = this.getParamsUnderForm();
      // get params except those in the form: for the case where form relatd url params anre changing and outside params exsist (so they wont be overitten)


      if (JSON.stringify(check) !== JSON.stringify(this.urlParams)) {

        const outerParams = pickBy({ ...this.route.snapshot.queryParams }, (_, key) => !Object.keys(this.form.value).includes(key));

        navExtras.queryParams = { ...navExtras.queryParams, ...outerParams };
        this.router.navigate([], navExtras);
      }
    });

    if (this.urlParams)
      this.CustomFormInit();
  }
  /**
   * implement in inherited for complex fields
   */
  protected CustomFormInit() {
    console.debug("implement function");
  }
  setFilterFields(controls: { [key: string]: AbstractControl; }) {
    this.fields = this.initiateData();
    console.log(controls);
  }
  handleFilter(value: string, filterdName: string, name: string, textName: string) {

    if (value.length === 0)
      this.fields[filterdName] = this[name];
    else
      this.fields[filterdName] = this[name].filter((s: string) => s[textName].indexOf(value) !== -1);
  }
  private _getParams(coll: any): JSON {
    let input = '';
    coll.forEach((element, key) => {
      if (element != '') {
        if (input != '') input = input.concat(',');
        input = input.concat(input, ` "${key}": "${element}" `);
      }
    });

    return JSON.parse(`{ ${input} }`);
  }

  initBaseForm(form: FormGroup) {
    return form;
  }

}
