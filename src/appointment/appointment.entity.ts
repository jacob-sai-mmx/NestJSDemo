import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property()
  date!: string;

  @Property()
  time!: string;

  @Property()
  slotsBooked!: number;
}
