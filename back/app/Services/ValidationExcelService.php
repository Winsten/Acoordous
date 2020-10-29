<?php

namespace App\Services;
use Validator;
class ValidationExcelService
{


	public function validationFields($rows, $regras)
	{
		$linha = 1;

		foreach ($rows as $row)
		{
			if ($linha > 1) {
				$localerror = $linha + 1;
				$localerrorRegras = array_merge($row->toArray(),['linhaerror' => $localerror]);
				$validator2 = Validator::make($row->toArray(), $regras->rules($localerrorRegras));

				if ($validator2->fails()) {

					$validator2->errors()->add('linha'.$localerror, 'O erro acima é encontrado na linha: '.$localerror.' do arquivo enviado.');
					$validator->messages()->merge($validator2->messages());

				}

			}else{
				$localerror = $linha + 1;
				$localerrorRegras = array_merge($row->toArray(),['linhaerror' => $localerror]);
				$validator = Validator::make($row->toArray(), $regras->rules($localerrorRegras));
				if ($validator->fails()) {
					$validator->errors()->add('linha'.$localerror, 'O erro acima é encontrado na linha: '.$localerror.' do arquivo enviado.');
				}
			}
			$linha++;

		}

		return $validator;
	}

}