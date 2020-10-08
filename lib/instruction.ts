export enum Instruction {
    INC = '+',
    DEC = '-',
    INC_P = '>',
    DEC_P = '<',
    TO_SX = '}',
    FROM_SX = '{',
    TO_TX = ')',
    FROM_TX = '(',
    TO_AX = '\'',
    FROM_AX = '^',
    LOOP_START = '[',
    LOOP_END = ']',
    MEASURE = ',',
    HEAT = '$',
    TRANSFER = '@',
    ISOLATE = '#',
    PRINT = '.',
    COMPILE = '~',
    META = '!'
}
