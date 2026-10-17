<?php

namespace App\Http\Requests\Admin;

use App\Models\AuditLog;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class AuditLogIndexRequest extends FormRequest
{
    use ApiResponse;

    public function authorize(): bool
    {
        // Admin check already happened in the 'is.admin' middleware.
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string', Rule::in([
                AuditLog::TYPE_LOGIN,
                AuditLog::TYPE_LOGOUT,
                AuditLog::TYPE_CREATE,
                AuditLog::TYPE_UPDATE,
                AuditLog::TYPE_DELETE,
                AuditLog::TYPE_APPROVE,
                AuditLog::TYPE_REJECT,
                AuditLog::TYPE_VERIFICATION,
                AuditLog::TYPE_PERMISSION_CHANGE,
                AuditLog::TYPE_EXPORT,
            ])],
            'role' => ['nullable', 'string', Rule::in([
                AuditLog::ROLE_ADMIN,
                AuditLog::ROLE_ORGANIZATION,
                AuditLog::ROLE_PARTICIPANT,
            ])],
            'status' => ['nullable', 'string', Rule::in([
                AuditLog::STATUS_SUCCESS,
                AuditLog::STATUS_FAILED,
                AuditLog::STATUS_WARNING,
            ])],
            'location' => ['nullable', 'string', Rule::in([
                AuditLog::LOCATION_DASHBOARD,
                AuditLog::LOCATION_USERS,
                AuditLog::LOCATION_ORGANIZATIONS,
                AuditLog::LOCATION_EVENTS,
                AuditLog::LOCATION_REPORTS,
                AuditLog::LOCATION_SETTINGS,
                AuditLog::LOCATION_SECURITY,
            ])],
            'sensitive' => ['nullable', 'boolean'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->validationError($validator->errors(), 'Validation failed. Please check your inputs.')
        );
    }
}