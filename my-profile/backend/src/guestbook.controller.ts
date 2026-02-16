import { Controller, Get, Post, Body } from '@nestjs/common';
import { GuestbookService } from './guestbook.service';

@Controller('guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Get()
  async getGuestbook() { return this.guestbookService.getEntries(); }

  @Post()
  async createEntry(@Body() body: any) { return this.guestbookService.addEntry(body); }
}