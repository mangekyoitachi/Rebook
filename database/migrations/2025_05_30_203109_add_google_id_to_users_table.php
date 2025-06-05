<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // // Use raw SQL to ensure it works
        // DB::statement('ALTER TABLE users MODIFY COLUMN `password` VARCHAR(255) NULL');

        // // Add other columns if they don't exist
        // Schema::table('users', function (Blueprint $table) {
        //     if (!Schema::hasColumn('users', 'google_id')) {
        //         $table->string('google_id')->nullable()->unique()->after('password');
        //     }

        //     if (!Schema::hasColumn('users', 'avatar')) {
        //         $table->string('avatar')->nullable()->after('google_id');
        //     }
        // });
            // Use raw SQL to ensure it works
    Schema::table('users', function (Blueprint $table) {
        $table->string('password_temp')->nullable();
    });

    DB::statement('UPDATE users SET password_temp = password');
    DB::statement('ALTER TABLE users DROP COLUMN password');
    DB::statement('ALTER TABLE users RENAME COLUMN password_temp TO password');

        
        
    }

    /**
     * Reverse the migrations.
     */
     public function down(): void
    {
        // DB::statement('ALTER TABLE users MODIFY COLUMN `password` VARCHAR(255) NOT NULL');

        // Schema::table('users', function (Blueprint $table) {
        //     if (Schema::hasColumn('users', 'google_id')) {
        //         $table->dropColumn('google_id');
        //     }

        //     if (Schema::hasColumn('users', 'avatar')) {
        //         $table->dropColumn('avatar');
        //     }
        // });
         // Use raw SQL to ensure it works
    Schema::table('users', function (Blueprint $table) {
        $table->string('password_temp')->nullable();
    });

    DB::statement('UPDATE users SET password_temp = password');
    DB::statement('ALTER TABLE users DROP COLUMN password');
    DB::statement('ALTER TABLE users RENAME COLUMN password_temp TO password');
    DB::statement('ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL');
    }
};
