<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContratoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email',
            'nome' => 'required',
            'cpf' => 'sometimes|required|cpf',
            'cnpj' => 'sometimes|required|cnpj',
            'imovel_id' => 'required'
        ];
    }
}
