export class Identificacion{

    Id : number;

    Albaran : string;

    IdCentro : number;

    Nombre : string;

    DNI : string;

    ListaArchivos : ListaArchivos[] = [];

    Etiqueta : string;

    IdResiduo : number;

    IdMarca : number;

    NumSerie : string;

    Funciona : boolean;

    Canibalizado : boolean;

    Imagenes : string[];

    Tipo : Tipo;

    Fecha : string;

    Coordenadas : Coordenada;

    IdTercero : number;

}

export enum Tipo{

    domicilio = 12,

    establecimiento = 13,

    entrada = 14, 

    salida = 15
}

export class Coordenada {

    Latitud : number;

    Longitud : number;

}

export class ListaArchivos{

    ArchivoCodificado : string;

    Tipo : string;

}