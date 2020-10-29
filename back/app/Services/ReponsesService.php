<?php

namespace App\Services;
//
// Classe utilizada para padronizar os retornos do sistema
//
class ReponsesService
{
	public function ResponsesCreate($item)
	{
		return [
			'status' => 'success',
			'title' => 'Sucesso',
			'message' => 'Criado com sucesso.',
			'id' => $item->id,
			'data' => $item->toArray()
		];
	}

	public function ResponsesUpdate($item)
	{
		return [
			'status' => 'success',
			'title' => 'Sucesso',
			'message' => 'Atualizado com sucesso.',
			'id' => $item->id,
			'data' => $item->toArray()
		];
	}

	public function ResponsesForm($item)
	{
		return [
			'status' => 'success',
			'title' => 'Sucesso',
			'message' => 'Atualizado com sucesso.',
			'formdata' => $item->toArray()
		];
	}

	public function ResponsesError($error)
	{
		return [
			'status' => 'error',
			'title' => 'Erro ao gravar registro.',
			'message' => $error
		];
	}

	public function ResponsesDelete()
	{
		return [
			'status' => 'success',
			'title' => 'Sucesso',
			'message' => 'Deletado com sucesso.'
		];
	}

	public function ResponsesRestore()
	{
		return [
			'status' => 'success',
			'title' => 'Sucesso',
			'message' => 'Restaurado com sucesso.'
		];
	}

	public function ResponsesEdit($item)
	{
		return response()->json($item);
	}
}
