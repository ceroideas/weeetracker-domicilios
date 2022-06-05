export class Stock{

    IdCentro : number;

    IdTercero : number;

    listaStock : StockResiduoEspecifico[];

}

export class StockResiduoEspecifico{
    
    id : number;

    nombre : string;

    cantidad : number;
}
