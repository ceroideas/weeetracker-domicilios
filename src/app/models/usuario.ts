import { Tercero } from './tercero';
import { Perfiles } from './perfiles';
import { Centro } from './centro';
import { Residuo } from './residuos';
import { Marcas } from './marcas';
import { ResiduoEspecifico } from './residuoEspecifico';

export class Usuario{

    id:number;

    login:string;
    
    password:string;

    tercero:Tercero;

    dtercero:string;
    terminal:string;
    sidsig:string;

    responsabilidades:any;

    tipoTercero:number;

    estado:number;

    marcas:Marcas[];

    perfiles:Perfiles[];

    centros:Centro[];

    residuos:ResiduoEspecifico[];    

    direcciones:any;
    
    direccionTercero:any;
}