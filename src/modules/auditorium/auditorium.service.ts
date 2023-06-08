import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditoriumService {
  create() {
    return 'This action adds a new auditorium';
  }

  findAll() {
    return `This action returns all auditorium`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auditorium`;
  }

  update(id: number) {
    return `This action updates a #${id} auditorium`;
  }

  remove(id: number) {
    return `This action removes a #${id} auditorium`;
  }
}
