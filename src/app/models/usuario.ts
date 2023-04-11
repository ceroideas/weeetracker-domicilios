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

    tipoTercero:number;

    estado:number;

    marcas:Marcas[];

    perfiles:Perfiles[];

    centros:Centro[];

    residuos:ResiduoEspecifico[];    
}