export interface NumberValidationOptions 
{
    allowZero?          : boolean;
    allowNegatives?     : boolean;
    allowDecimals?      : boolean;
}

export interface ArrayValidationOptions 
{
    allowEmpty?         : boolean;
}

export interface ObjectValidationOptions 
{
    requiredProperties? : string[];
    minProperties?      : number;
}

// module.exports = { NumberValidationOptions, ArrayValidationOptions, ObjectValidationOptions }
