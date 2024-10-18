import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Config {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'jsonb', nullable: true })
  unavailableDates?: string[];

  @Property({ type: 'jsonb', nullable: true })
  unavailableDays?: string[];

  @Property()
  maxSlots!: number;

  @Property()
  intervalDuration!: number;

  @Property()
  startTime!: string;

  @Property()
  endTime!: string;
}
