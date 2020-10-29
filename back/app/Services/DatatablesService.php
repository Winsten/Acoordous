<?php

namespace App\Services;

use Auth;
use Gate;
// 
// Classe utilizada para criar datatables e seus respectivos elementos.
// 
class DatatablesService
{

	private $local, $visualizar, $atualizar, $deletar;

	public function generatedatatablelixeira($users, $local)
	{
		$this->local = $local;
		$datatable =  app('datatables')->of($users)
			->editColumn('created_at', function ($user) {
				return (isset($user->created_at)) ? with(new \Carbon\Carbon($user->created_at))->format('d/m/Y') : '';
			})
			->filterColumn('created_at', function ($query, $keyword) {
				$query->whereRaw("DATE_FORMAT(created_at,'%d/%m/%Y') like ?", ["%$keyword%"]);
			})
			->addColumn('action', function ($user) {
				return $this->BotoesDataTablesLixeira($user->id, $this->local);
			});
		return $datatable;
	}

	public function generatedatatable($users, $local, $visualizar = true, $atualizar = true, $deletar = true)
	{

		$this->local = $local;
		$this->visualizar = $visualizar;
		$this->atualizar = $atualizar;
		$this->deletar = $deletar;

		$datatable = app('datatables')->of($users)
			->editColumn('created_at', function ($user) {
				return (isset($user->created_at)) ? with(new \Carbon\Carbon($user->created_at))->format('d/m/Y') : '';
			})
			->filterColumn('created_at', function ($query, $keyword) {
				$query->whereRaw("DATE_FORMAT(created_at,'%d/%m/%Y') like ?", ["%$keyword%"]);
			})
			->addColumn('action', function ($user) {
				return $this->BotoesDataTables($user->id, $this->local, $this->visualizar, $this->atualizar, $this->deletar);
			});

		return $datatable;
	}

	public function BotoesDataTables($campo, $local, $visualizar = true, $atualizar = true, $deletar = true)
	{
		$botoes = '';

		$tamanho = 'style="width: 15px"';

		if ($visualizar) {
			$botoes = $botoes . ' <button ' . $tamanho . ' hint="Visualizar o item" type="button" value="' . $campo . '"  title="Visualizar ' . $local . '" class="q-btn bg-primary text-white datatables_visualizar text-center justify-center q-btn__wrapper"><i class="fas fa-eye" aria-hidden="true"></i></button>';
		}

		if ($atualizar) {
			$botoes = $botoes . ' <button ' . $tamanho . ' hint="Editar o item" type="button" value="' . $campo . '"  title="Editar ' . $local . '" class="q-btn bg-secondary text-white datatables_editar text-center justify-center q-btn__wrapper"><i class="fas fa-pencil-alt" aria-hidden="true"></i></button>';
		}

		if ($deletar) {
			$botoes = $botoes . ' <button ' . $tamanho . ' hint="Deletar o item" type="button" value="' . $campo . '"  title="Deletar ' . $local . '" class="q-btn bg-red text-white datatables_deletar text-center justify-center q-btn__wrapper"><i class="fas fa-trash" aria-hidden="true"></i></button>';
		}
		return $botoes;
	}

	// <button  type="button" value="' . $user->id . '"  title="Criar usuários" class="q-btn bg-accent text-white datatables_empresa  text-center justify-center q-btn__wrapper"><i class="fas fa-users" aria-hidden="true"></i></button> ';


	public function BotoesDataTablesLixeira($campo, $local)
	{
		$tamanho = 'style="width: 15px"';

		return '  <button ' . $tamanho . ' type="button" value="' . $campo . '" hint="Restaurar o item" title="Restaurar ' . $local . '" class="q-btn bg-positive text-white datatables_restaurar text-center justify-center q-btn__wrapper"><i class="fas fa-undo" aria-hidden="true"></i></button>
		';
	}
}
