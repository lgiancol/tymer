import { Pipe, PipeTransform } from '@angular/core';
import { DisplayableEntry } from '../model/DisplayableEntry';
import * as _ from 'lodash';

@Pipe({
  name: 'totalHours'
})
export class TotalHoursPipe implements PipeTransform {

  transform(value: DisplayableEntry[]): number {
    return _.chain(value).flatMap(de => de.getTimeEntries()).map('duration').sum().value();
  }

}
