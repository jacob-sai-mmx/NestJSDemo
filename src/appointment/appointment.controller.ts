import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('available-slots')
  async getAvailableSlots(
    @Query('date') date: string,
  ): Promise<{ date: string; time: string; availableSlots: number }[]> {
    return this.appointmentService.getAvailableSlots(date);
  }

  @Post('book')
  async bookAppointment(
    @Body() body: { date: string; time: string },
  ): Promise<Appointment | null> {
    return this.appointmentService.bookAppointment(body.date, body.time);
  }
}
