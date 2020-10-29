<?php

namespace App\Services;

class RetornaCaminhoService
{
	public function RetornaCaminhoImg($value)
	{
		$array = explode('/', $value);
		$img_name = '';
		foreach ($array as $key => $value) {
			if ($key > 4) {
				$img_name = $img_name.'/'.$value;
			}
		}
		return substr($img_name,1);
	}
}