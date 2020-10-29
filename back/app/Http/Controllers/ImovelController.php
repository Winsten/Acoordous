<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;
use App\Models\Imovel;
use App\Http\Requests\ImovelRequest;
use App\Services\DatatablesService;
use App\Services\ReponsesService;

class ImovelController extends Controller
{
    private $responseservices, $botoesdatatable;
    public function __construct()
    {
        $this->responseservices = new ReponsesService();
    }

    //
    // O método anydata é utilizado para criação e busca do datatables
    //
    public function anyData(Request $request)
    {

        $users = Imovel::select(['id', 'endereco', 'status']);
        $this->botoesdatatable = new DatatablesService();

        $datatables = app('datatables')->of($users)
            //Modifica a coluna status para visualiar o contratado ou não contratado "o campo status é boolean"
            ->editColumn('status', function ($user) {
                return ($user->status) ? "Contratado" : 'Não contratado';
            })
            //Modifica a busca na coluna status para visualiar o contratado ou não contratado "o campo status é boolean"
            ->filterColumn('status', function ($query, $keyword) {
                (strpos(strtolower($keyword), 'não') !== false ? $query->where('status', '=', 0) : $query->where('status', '=', 1));
            })
            //Adiciona os botões do datatables que são injetados por aqui.
            ->addColumn('action', function ($user) {
                if (!$user->status) {
                    $botoes = '<button style="width: auto" type="button" value="' . $user->id . '"  title="Criar Contrato" class="datatables_contrato q-btn bg-green text-center justify-center text-white q-btn__wrapper">
                    <i class="fas fa-file-signature" aria-hidden="true"> Adicionar Contrato</i>
                    </button>';
                } else {
                    $botoes = '<button style="width: auto" type="button" value="' . $user->id . '"  title="Visualizar Contrato" class="datatables_remover_contrato q-btn bg-black text-center justify-center text-white q-btn__wrapper">
                    <i class="fas fa-file-alt" aria-hidden="true"> Visualizar Contrato</i>
                    </button>';
                }

                $botoes = $botoes . $this->botoesdatatable->BotoesDataTables($user->id, 'imovel');
                return $botoes;
            });
        return $datatables->make(true);
    }
    //
    // O método anydatalixeira é utilizado para criação e busca do datatables no modo lixeira
    //
    public function anyDatalixeira()
    {
        $users = Imovel::select(['id', 'endereco', 'status'])->onlyTrashed();
        $botoesdatatable = new DatatablesService();
        $datatables =  $botoesdatatable->generatedatatablelixeira($users, 'Imoveis');
        return $datatables->make(true);
    }
    //
    // O método ClearString é utilizado internamente para limpar a string que vem do frontend e remove também a virgula para evitar quebra do código de procura do datatables
    //
    private function ClearString($string)
    {
        $string = str_replace(",", "", $string);
        $string = trim($string);
        return $string;
    }
    //
    // O método GenerateString é utilizado internamente colocar a virgula antes de enviar para o banco de dados "pois o requisito pediu para apresentar os dados de Rua, número, cidade, estado (separados por vírgula); com isso criei um campo no banco onde insiro já formatado de acordo com o requisito para facilitar a busca do datatables.
    //
    private function GenerateString($string)
    {
        if ($string != "") {
            $string = ',' . $string;
        }
        return $string;
    }


    public function store(ImovelRequest $request)
    {
        try {
            DB::beginTransaction();
            // $Imovel = Imovel::create($request->all());
            $Imovel = new Imovel();
            $Imovel->email = $request->email;
            $Imovel->rua = $request->rua;
            $Imovel->numero = $request->numero;
            $Imovel->bairro = $request->bairro;
            $Imovel->complemento = $request->complemento;
            $Imovel->cidade = $request->cidade;
            $Imovel->estado = $request->estado;
            $rua = $this->ClearString($request->rua);
            $numero = $this->ClearString($request->numero);
            $cidade = $this->ClearString($request->cidade);
            $estado = $this->ClearString($request->estado);
            $Imovel->endereco = $rua . $this->GenerateString($numero) . $this->GenerateString($cidade) . $this->GenerateString($estado);
            $Imovel->save();
            DB::commit();

            return response($this->responseservices->ResponsesCreate($Imovel), 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->responsesError($e), 400);
        }
    }

    public function edit($id)
    {
        $Imovel = Imovel::findOrFail($id);
        return $this->responseservices->ResponsesEdit($Imovel);
    }


    public function update(ImovelRequest $request, $id)
    {
        try {

            DB::beginTransaction();
            $Imovel = Imovel::findOrFail($id);
            $Imovel->email = $request->email;
            $Imovel->rua = $request->rua;
            $Imovel->numero = $request->numero;
            $Imovel->bairro = $request->bairro;
            $Imovel->complemento = $request->complemento;
            $Imovel->cidade = $request->cidade;
            $Imovel->estado = $request->estado;
            $rua    = $this->ClearString($request->rua);
            $numero = $this->ClearString($request->numero);
            $cidade = $this->ClearString($request->cidade);
            $estado = $this->ClearString($request->estado);
            $Imovel->endereco = $rua . $this->GenerateString($numero) . $this->GenerateString($cidade) . $this->GenerateString($estado);
            $Imovel->save();
            DB::commit();
            return response($this->responseservices->ResponsesUpdate($Imovel), 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->ResponsesError($e), 400);
        }
    }


    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $Imovel = Imovel::find($id);
            $Imovel->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->ResponsesError($e), 400);
        }
    }

    public function restaurar($id)
    {
        try {

            Imovel::where('id', '=', $id)->restore();
            DB::commit();
            return response($this->responseservices->ResponsesRestore(), 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response($this->responseservices->ResponsesError($e), 400);
        }
    }
}
