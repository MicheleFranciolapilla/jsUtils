export interface NumberValidationOptions 
{
    allowZero?          :   boolean;
    allowNegatives?     :   boolean;
    allowDecimals?      :   boolean;
}

export interface ArrayValidationOptions 
{
    /**
     * @deprecated Use `minItems` instead.
     */
    allowEmpty?         :   boolean;

    minItems?           :   number;
    maxItems?           :   number;
    uniqueItems?        :   boolean;
}

export interface ObjectValidationOptions 
{
    requiredProperties? :   string[];
    minProperties?      :   number;
}
