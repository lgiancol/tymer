import { TimeUtil } from './time-util';

describe('TimeUtil', () => {
    it('should convert 1 hour to 3600000 milliseconds', () => {
        const milliseconds = TimeUtil.HoursToMillis(1);
        expect(milliseconds).toEqual(3600000);
    });

    it('should convert 3600000 milliseconds to 1 hour', () => {
        const hours = TimeUtil.MillisToHours(3600000);
        expect(hours).toEqual(1);
    });

    it('should convert 5244120 milliseconds to 1.46 hours', () => {
        const hours = TimeUtil.MillisToHours(5244120);
        expect(hours).toEqual(1.46);
    });

    it('should clamp to nearest quarter hour', () => {
        let hours = 1;
        let millis = TimeUtil.HoursToMillis(hours);
        let clampedHours = TimeUtil.MillisToHours(TimeUtil.ClampToQuarter(millis)); // On the quarter
        expect(clampedHours).toEqual(1);

        hours = 1.1;
        millis = TimeUtil.HoursToMillis(hours);
        clampedHours = TimeUtil.MillisToHours(TimeUtil.ClampToQuarter(millis)); // Should round down
        expect(clampedHours).toEqual(1);

        hours = 1.2;
        millis = TimeUtil.HoursToMillis(hours);
        clampedHours = TimeUtil.MillisToHours(TimeUtil.ClampToQuarter(millis)); // Should round up
        expect(clampedHours).toEqual(1.25);
    });
});
