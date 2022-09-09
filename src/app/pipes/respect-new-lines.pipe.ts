import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'respectNewLines'
})
export class RespectNewLinesPipe implements PipeTransform {

    transform(str: string): string {
        const r = str.replace("\n", "<br>");
        console.log(r);

        return r
    }

}
