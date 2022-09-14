export class TimeUtil {
    static Round(toRound: number) {
        return Math.round((toRound + Number.EPSILON) * 100) / 100;
    }

    static HoursToMillis(hours: number) {
        return hours * 60 * 60 * 1000;
    }

    static MillisToHours(milliseconds: number) {
        const hours = milliseconds / 60 / 60 / 1000;
        return this.Round(hours);
    }

    static MillisToMinutes(milliseconds: number) {
        const minutes = milliseconds / 60 / 1000;
        return this.Round(minutes);
    }

    static ClampToQuarter(milliseconds: number) {
        const minutes = this.MillisToMinutes(milliseconds);
        const minutesFromQuarter = (minutes) % 15; // < 7 we round down

        if(minutesFromQuarter == 0) return milliseconds;

        // Clamp to the closest quarter
        const multiplier = minutesFromQuarter >= 8 ? 1 : -1;
        const deltaMinutes = multiplier == -1 ? minutesFromQuarter : 15 - minutesFromQuarter;

        return milliseconds + ((deltaMinutes * 60 * 1000) * multiplier);
    }

    static DifferenceFromNow(time: number) {
        return Date.now() - time;
    }
}
