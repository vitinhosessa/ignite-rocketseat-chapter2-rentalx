import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number {
    const startDateFormated = this.convertToUTC(start_date);
    const endDateFormated = this.convertToUTC(end_date);
    return dayjs(endDateFormated).diff(startDateFormated, "hours");
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const startDateFormated = this.convertToUTC(start_date);
    const endDateFormated = this.convertToUTC(end_date);
    return dayjs(endDateFormated).diff(startDateFormated, "days");
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  addDays(days: number): Date {
    return dayjs().add(days, "days").toDate();
  }

  addHours(hours: number): Date {
    return dayjs().add(hours, "hours").toDate();
  }

  compareIfBefore(startDate: Date, endDate: Date): boolean {
    return dayjs(startDate).isBefore(endDate);
  }
}

export { DayjsDateProvider };
