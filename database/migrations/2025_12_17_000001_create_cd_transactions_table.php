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
        Schema::create('cd_transactions', function (Blueprint $table) {
            $table->id();
            // human-friendly transaction id (e.g. CDZOOM000001)
            $table->string('transaction_id')->nullable()->unique();
            $table->foreignId('cd_id')->nullable()->constrained('cd_masters')->nullOnDelete();
            $table->string('credit_type')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('status')->nullable();
            // transaction timestamp (when this credit/debit occurred)
            $table->timestamp('timestamp')->useCurrent();
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
        Schema::dropIfExists('cd_transactions');
    }
};
