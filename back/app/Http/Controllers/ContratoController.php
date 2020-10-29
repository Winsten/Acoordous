<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use App\Models\Contrato;
use App\Models\Imovel;
use App\Http\Requests\ContratoRequest;
use App\Services\DatatablesService;
use App\Services\ReponsesService;

class ContratoController extends Controller
{
    private $responseservices, $botoesdatatable;
    public function __construct()
    {
        $this->responseservices = new ReponsesService();
    }



    public function store(ContratoRequest $request)
    {
        try {
            DB::beginTransaction();
            $Imovel = Imovel::findOrFail($request->imovel_id);
            $Imovel->status = true;
            $Imovel->save();
            $Contrato = Contrato::create($request->except(['tipo']));
            DB::commit();

            return response($this->responseservices->ResponsesCreate($Contrato), 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->responsesError($e), 400);
        }
    }

    public function edit($id)
    {
        $Imovel = Imovel::where('imovel.id', '=', $id)
            ->join('contratos', 'imovel.id', '=', 'contratos.imovel_id')
            ->select('contratos.email as email', 'contratos.nome as nome', 'contratos.cpf as cpf', 'contratos.cnpj as cnpj')->get();
        return $this->responseservices->ResponsesEdit($Imovel);
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $Imovel = Imovel::findOrFail($id);
            $Imovel->status = false;
            $Contrato = Contrato::where('imovel_id', '=', $id)->delete();

            $Imovel->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->ResponsesError($e), 400);
        }
    }
}
