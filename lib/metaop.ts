import { Resevoir } from './resevoir';

export enum MetaOpType {
    PRINT = 'print',
    RELABEL = 'relabel'
}

export interface MetaOp {
    operation: MetaOpType,
    arguments: any
}

export interface PrintArgs {
    str: string;
}

export function isPrintArgs(value: unknown): value is PrintArgs {
    return typeof value === 'object'
        && typeof (value as PrintArgs).str === 'string';
}

export interface PrintMetaOp extends MetaOp {
    operation: MetaOpType.PRINT;
    arguments: PrintArgs;
}

export function isPrintMetaOp(value: unknown): value is PrintMetaOp {
    return typeof value === 'object'
        && (value as PrintMetaOp).operation === MetaOpType.PRINT
        && isPrintArgs((value as PrintMetaOp).arguments);
}

export interface RelabelArgs {
    resevoirIndex: number;
    resevoir: Resevoir;
}

export function isRelabelArgs(value: unknown): value is RelabelArgs {
    return typeof value === 'object'
        && typeof (value as RelabelArgs).resevoirIndex === 'number'
        && (value as RelabelArgs).resevoir instanceof Resevoir;
}

export interface RelabelMetaOp extends MetaOp {
    operation: MetaOpType.RELABEL;
    arguments: RelabelArgs;
}

export function isRelabelMetaOp(value: unknown): value is RelabelMetaOp {
    return typeof value === 'object'
        && (value as RelabelMetaOp).operation === MetaOpType.RELABEL
        && isRelabelArgs((value as RelabelMetaOp).arguments);
}
