import { Pipe, PipeTransform, NgZone, ChangeDetectorRef } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
    name: 'tymer',
    pure: false
})
export class TymerPipe implements PipeTransform {
    private timer: number | null = null;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone
    ) { }

    /**
     * Gets the millisecond difference between a date and now
     * @private
     * @param   startDate: string
     * @returns number  milliseconds remaining
     */
    private getMsDiff = (startDate: Date): number => (Date.now() - startDate.getTime());

    /**
     * Converts milliseconds to the
     *
     * @private
     * @param msDiff
     * @returns null    when no time is remaining
     *          string  in the format `HH:mm:ss`
     */
    private msToTime(msDiff: number): string {
        let seconds: string | number = Math.floor((msDiff / 1000) % 60),
            minutes: string | number = Math.floor((msDiff / (1000 * 60)) % 60),
            hours: string | number = Math.floor((msDiff / (1000 * 60 * 60)) % 24);

        /**
         * Add the relevant `0` prefix if any of the numbers are less than 10
         * i.e. 5 -> 05
         */
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        hours = (hours < 10) ? '0' + hours : hours;

        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * @param startDate    should be in a valid Date Time format
     *                      e.g. YYYY-MM-DDTHH:mm:ss.msz
     *                      e.g. 2021-06-04T17:27:10.740z
     */
    public transform(startDate: Date | null): string {
        this.removeTimer();
        if (!startDate) return this.msToTime(0);
        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, 1000);
            }
            return null;
        });

        return this.msToTime(this.getMsDiff(startDate));
    }

    private removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
}