<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nick' => ['required', 'string', Rule::unique('users', 'nick')->ignore($this->route('user'), 'id'), 'min:6', 'max:20'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($this->route('user'), 'id')],
            'first_name' => 'required|string|min:2|max:20',
            'last_name' => 'required|string|min:2|max:20',
            'gender' => [
                'required',
                'string',
                Rule::in(['male', 'female'])
            ]
        ];
    }
}
