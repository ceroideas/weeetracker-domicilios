export class ASolicitud{
    
    idCentro : string;

    Albaran : string;

    Observaciones : string;

    ListaResiduosEspecificos : ALinea[];
}

export class ALinea{

  idResiduo : number;

  Unidades : number;

  Nombre : string;

}