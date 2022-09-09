import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'respectNewLines'
})
export class RespectNewLinesPipe implements PipeTransform {

    transform(str: string): string {
        return str.replace("\n", "<br>");
    }

}
