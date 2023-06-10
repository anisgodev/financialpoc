package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.BusinessProcess;
import com.bnppf.alphacredit.creditproductdesigner.domain.enumeration.ParameterType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A BusinessModel.
 */
@Document(collection = "business_model")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class BusinessModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("name")
    private String name;

    @NotNull(message = "must not be null")
    @Field("type")
    private ParameterType type;

    @NotNull(message = "must not be null")
    @Field("category")
    private BusinessProcess category;

    @Field("relatedBusinessModels")
    @JsonIgnoreProperties(value = { "relatedBusinessModels" }, allowSetters = true)
    private BusinessModel relatedBusinessModels;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public BusinessModel id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public BusinessModel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ParameterType getType() {
        return this.type;
    }

    public BusinessModel type(ParameterType type) {
        this.setType(type);
        return this;
    }

    public void setType(ParameterType type) {
        this.type = type;
    }

    public BusinessProcess getCategory() {
        return this.category;
    }

    public BusinessModel category(BusinessProcess category) {
        this.setCategory(category);
        return this;
    }

    public void setCategory(BusinessProcess category) {
        this.category = category;
    }

    public BusinessModel getRelatedBusinessModels() {
        return this.relatedBusinessModels;
    }

    public void setRelatedBusinessModels(BusinessModel businessModel) {
        this.relatedBusinessModels = businessModel;
    }

    public BusinessModel relatedBusinessModels(BusinessModel businessModel) {
        this.setRelatedBusinessModels(businessModel);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessModel)) {
            return false;
        }
        return id != null && id.equals(((BusinessModel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessModel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", category='" + getCategory() + "'" +
            "}";
    }
}
