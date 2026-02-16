import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') as string;
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY') as string;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase URL or Key in .env file');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getEntries() {
    const { data, error } = await this.supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    return data;
  }

  async addEntry(entry: any) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([entry]);

    if (error) throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    return { success: true };
  }
}