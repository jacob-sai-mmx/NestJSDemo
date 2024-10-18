import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Appointment } from './appointment.entity';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: EntityRepository<Appointment>,
    private readonly configService: ConfigService,
  ) {}

  async getAvailableSlots(
    date: string,
  ): Promise<{ date: string; time: string; availableSlots: number }[]> {
    this.validateDate(date);
    const config = await this.getConfig();

    const targetDate = new Date(date);
    this.checkUnavailableDates(config, date, targetDate);

    const bookedAppointments = await this.appointmentRepository.find({ date });
    return this.generateAvailableSlots(config, bookedAppointments, date);
  }

  async bookAppointment(
    date: string,
    time: string,
  ): Promise<Appointment | null> {
    this.validateDate(date);
    const config = await this.getConfig();

    const targetDate = new Date(date);
    this.checkUnavailableDates(config, date, targetDate);

    const appointment = await this.appointmentRepository.findOne({
      date,
      time,
    });

    if (appointment) {
      return this.updateExistingAppointment(appointment, config);
    } else {
      return this.createNewAppointment(date, time);
    }
  }

  private validateDate(dateString: string): void {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString) || isNaN(new Date(dateString).getTime())) {
      throw new HttpException(
        'Invalid date format. Please use YYYY-MM-DD.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getConfig() {
    const config = await this.configService.getConfig();
    if (!config) {
      throw new HttpException(
        'Configuration not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return config;
  }

  private checkUnavailableDates(
    config: any,
    date: string,
    targetDate: Date,
  ): void {
    const unavailableDates = config.unavailableDates || [];
    const unavailableDays = config.unavailableDays || [];
    const dayName = targetDate.toLocaleString('en-US', { weekday: 'long' });

    if (unavailableDates.includes(date)) {
      throw new HttpException(
        'The selected date is unavailable.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (unavailableDays.includes(dayName)) {
      throw new HttpException(
        'The selected day is unavailable.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async updateExistingAppointment(
    appointment: Appointment,
    config: any,
  ): Promise<Appointment> {
    appointment.slotsBooked += 1;

    if (appointment.slotsBooked > config.maxSlots) {
      throw new HttpException(
        'Unable to book the appointment. The requested number of slots exceeds the maximum allowed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.appointmentRepository
      .getEntityManager()
      .persistAndFlush(appointment);
    return appointment;
  }

  private async createNewAppointment(
    date: string,
    time: string,
  ): Promise<Appointment> {
    const newAppointment = this.appointmentRepository.create({
      date,
      time,
      slotsBooked: 1,
    });

    await this.appointmentRepository
      .getEntityManager()
      .persistAndFlush(newAppointment);
    return newAppointment;
  }

  private generateAvailableSlots(
    config: any,
    bookedAppointments: Appointment[],
    date: string,
  ): { date: string; time: string; availableSlots: number }[] {
    const availableSlots: {
      date: string;
      time: string;
      availableSlots: number;
    }[] = [];
    const [startHour, startMinute] = config.startTime.split(':').map(Number);
    const [endHour, endMinute] = config.endTime.split(':').map(Number);
    const intervalDuration = config.intervalDuration;

    for (let hour = startHour; hour <= endHour; hour++) {
      let minute = hour === startHour ? startMinute : 0;

      for (; minute < 60; minute += intervalDuration) {
        if (hour === endHour - 1 && minute + intervalDuration > endMinute) {
          break;
        }

        const timeSlot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const existingBooking = bookedAppointments.find(
          (appointment) => appointment.time === `${timeSlot}:00`,
        );
        const availableSlotsCount = existingBooking
          ? Math.max(0, config.maxSlots - existingBooking.slotsBooked)
          : config.maxSlots;

        availableSlots.push({
          date,
          time: timeSlot,
          availableSlots: availableSlotsCount,
        });
      }
    }

    return availableSlots;
  }
}
