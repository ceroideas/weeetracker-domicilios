export class Solicitud{

     albaranOrigen : string;

     cod : number;

     descripcion : string;

     est : string;

     fechaAnulacion : string;

     fechaRecogida : string;

     fechaSolicitud : string;

     linea : Linea[];

     nombreTerceroAsignado : string;

     observaciones: string;
}

export class Linea{

    frac : string;

    kil : string;

    res : string;

    resEspe : string;

    tipoCont : string;

    uni : string;

    descripcion : string;

    resEspeNombre : string;

    tipoContNombre : string;

    resNombre : string;

}