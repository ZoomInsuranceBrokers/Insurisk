<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('master_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->nullable()->constrained('partners')->nullOnDelete();
            $table->string('policy_name');
            $table->string('number')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('policy_type')->nullable();
            $table->string('policy_sub_type')->nullable();
            // additional policy fields
            $table->longText('term_and_condition')->nullable();
            // rates like 0.8 stored with 4 decimal places
            $table->decimal('intercity_rate', 8, 4)->default(0);
            $table->decimal('intracity_rate', 8, 4)->default(0);
            $table->foreignId('cd_account_id')->nullable()->constrained('cd_masters')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_delete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('master_policies');
    }
};
