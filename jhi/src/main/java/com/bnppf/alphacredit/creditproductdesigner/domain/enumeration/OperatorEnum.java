package com.bnppf.alphacredit.creditproductdesigner.domain.enumeration;

/**
 * The OperatorEnum enumeration.
 */
public enum OperatorEnum {
    NOT_EQUAL_TO,
    EQUAL_TO,
    GREATER_THAN,
    LESS_THAN,
    GREATER_THAN_OR_EQUAL_TO,
    LESS_THAN_OR_EQUAL_TO;

    private final String value;

    OperatorEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
