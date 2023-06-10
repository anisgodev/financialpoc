package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.OperatorEnum;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A BusinessRuleCondition.
 */
@Document(collection = "business_rule_condition")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BusinessRuleCondition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("field")
    private String field;

    @NotNull(message = "must not be null")
    @Field("value")
    private String value;

    @NotNull(message = "must not be null")
    @Field("operator")
    private OperatorEnum operator;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public BusinessRuleCondition id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getField() {
        return this.field;
    }

    public BusinessRuleCondition field(String field) {
        this.setField(field);
        return this;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getValue() {
        return this.value;
    }

    public BusinessRuleCondition value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public OperatorEnum getOperator() {
        return this.operator;
    }

    public BusinessRuleCondition operator(OperatorEnum operator) {
        this.setOperator(operator);
        return this;
    }

    public void setOperator(OperatorEnum operator) {
        this.operator = operator;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessRuleCondition)) {
            return false;
        }
        return id != null && id.equals(((BusinessRuleCondition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessRuleCondition{" +
            "id=" + getId() +
            ", field='" + getField() + "'" +
            ", value='" + getValue() + "'" +
            ", operator='" + getOperator() + "'" +
            "}";
    }
}
