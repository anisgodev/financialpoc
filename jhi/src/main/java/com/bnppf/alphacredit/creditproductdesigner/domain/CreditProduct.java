package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A CreditProduct.
 */
@Document(collection = "credit_product")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CreditProduct implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("name")
    private String name;

    @Field("businessModels")
    @JsonIgnoreProperties(value = { "relatedBusinessModels" }, allowSetters = true)
    private BusinessModel businessModels;

    @Field("rules")
    @JsonIgnoreProperties(value = { "conditions" }, allowSetters = true)
    private BusinessRule rules;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public CreditProduct id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CreditProduct name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BusinessModel getBusinessModels() {
        return this.businessModels;
    }

    public void setBusinessModels(BusinessModel businessModel) {
        this.businessModels = businessModel;
    }

    public CreditProduct businessModels(BusinessModel businessModel) {
        this.setBusinessModels(businessModel);
        return this;
    }

    public BusinessRule getRules() {
        return this.rules;
    }

    public void setRules(BusinessRule businessRule) {
        this.rules = businessRule;
    }

    public CreditProduct rules(BusinessRule businessRule) {
        this.setRules(businessRule);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CreditProduct)) {
            return false;
        }
        return id != null && id.equals(((CreditProduct) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CreditProduct{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
