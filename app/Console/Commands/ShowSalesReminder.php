<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Console\Scheduling\Schedule;

use Carbon\Carbon;


class ShowSalesReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:show-sales';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show a popup reminder on sales days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now('Asia/Manila')->startOfDay(); // Explicitly set timezone

        $monthlyDates = collect([
            '01-01', '02-02', '03-03', '04-04', '05-05', '06-06',
            '07-07', '08-08', '09-09', '10-10', '11-11', '12-12',
            '05-31'
        ]);

        $formattedToday = $today->format('m-d');
        $isMonthlyDate = $monthlyDates->contains($formattedToday);
        $isDayFifteenth = ($today->day === 15);

        $this->info("Today's Date: " . $today->toDateString());
        $this->info("Formatted Today: " . $formattedToday);
        $this->info("Is Day 15: " . ($isDayFifteenth ? 'true' : 'false'));
        $this->info("Is Monthly Date ('" . $formattedToday . "'): " . ($isMonthlyDate ? 'true' : 'false'));

        if ($isDayFifteenth || $isMonthlyDate) {
            Cache::put('show_sales_popup', true, now()->addMinutes(10));
            $this->info('Sales Reminder Triggered');
        } else {
            Cache::forget('show_sales_popup');
            $this->info('Not a sales date. No reminder shown.');
        }

        function schedule(Schedule $schedule)
        {
            $schedule->command('reminder:show-sales')->monthly();
        }
    }


}
