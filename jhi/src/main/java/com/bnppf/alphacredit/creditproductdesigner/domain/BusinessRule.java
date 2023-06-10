package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.BusinessProcess;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A BusinessRule.
 */
@Document(collection = "business_rule")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BusinessRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("name")
    private String name;

    @NotNull(message = "must not be null")
    @Field("business_process")
    private BusinessProcess businessProcess;

    @Field("conditions")
    private BusinessRuleCondition conditions;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public BusinessRule id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BusinessRule name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BusinessProcess getBusinessProcess() {
        return this.businessProcess;
    }

    public BusinessRule businessProcess(BusinessProcess businessProcess) {
        this.setBusinessProcess(businessProcess);
        return this;
    }

    public void setBusinessProcess(BusinessProcess businessProcess) {
        this.businessProcess = businessProcess;
    }

    public BusinessRuleCondition getConditions() {
        return this.conditions;
    }

    public void setConditions(BusinessRuleCondition businessRuleCondition) {
        this.conditions = businessRuleCondition;
    }

    public BusinessRule conditions(BusinessRuleCondition businessRuleCondition) {
        this.setConditions(businessRuleCondition);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessRule)) {
            return false;
        }
        return id != null && id.equals(((BusinessRule) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessRule{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", businessProcess='" + getBusinessProcess() + "'" +
            "}";
    }
}
