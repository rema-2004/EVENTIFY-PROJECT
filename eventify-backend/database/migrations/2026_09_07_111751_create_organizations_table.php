<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('organizations', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique(); // 👈 للروابط
        $table->string('email')->unique();
        $table->string('password');
        $table->string('phone')->nullable();
        
        // الشعار والوثائق
        $table->string('logo')->nullable();
        $table->string('license_document')->nullable();
        
        // حالة الحساب وملاحظات الأدمن
        $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])
              ->default('pending');
        $table->text('admin_notes')->nullable(); // 👈 أسباب الرفض أو الملاحظات
        $table->timestamp('verified_at')->nullable(); // 👈 تاريخ التوثيق
        
        $table->rememberToken();
        $table->softDeletes();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
