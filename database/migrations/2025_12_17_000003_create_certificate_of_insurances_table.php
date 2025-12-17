<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCertificateOfInsurancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificate_of_insurances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_policy_id')->constrained('master_policies')->onDelete('cascade');
            $table->string('status')->nullable();
            $table->string('item_number')->nullable();
            $table->string('gr_lr_number')->nullable();
            $table->date('gr_lr_date')->nullable();
            $table->string('insured_commodity')->nullable();
            $table->decimal('cargo_value', 15, 2)->nullable();
            $table->string('insured_name')->nullable();
            $table->string('cc_mail')->nullable();
            $table->text('insured_address')->nullable();
            $table->string('insured_mobile')->nullable();
            $table->string('insured_email')->nullable();
            $table->string('voyage_from')->nullable();
            $table->string('voyage_to')->nullable();
            $table->string('invoice_number')->nullable();
            $table->date('invoice_date')->nullable();
            $table->decimal('gross_premium', 12, 2)->nullable();
            $table->decimal('gst_premium', 12, 2)->nullable();
            $table->decimal('total_premium', 12, 2)->nullable();
            $table->string('declaration_id')->nullable();
            $table->text('description')->nullable();
            $table->string('master_policy_type')->nullable();
            $table->string('policy_source')->nullable();
            $table->string('vb_64')->nullable();

            $table->boolean('is_cancelled')->default(false);
            $table->text('cancellation_reason')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_intracity')->default(false);
            $table->boolean('is_intercity')->default(false);
            $table->string('cover_letter_no')->nullable();
            $table->string('cover_letter_link')->nullable();
            $table->boolean('is_cover_letter_sent')->default(false);

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
        Schema::dropIfExists('certificate_of_insurances');
    }
}
