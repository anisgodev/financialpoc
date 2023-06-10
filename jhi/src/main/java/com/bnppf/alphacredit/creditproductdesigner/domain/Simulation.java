package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Simulation.
 */
@Document(collection = "simulation")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Simulation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("name")
    private String name;

    @Field("creditProduct")
    @JsonIgnoreProperties(value = { "businessModels", "rules" }, allowSetters = true)
    private CreditProduct creditProduct;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Simulation id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Simulation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CreditProduct getCreditProduct() {
        return this.creditProduct;
    }

    public void setCreditProduct(CreditProduct creditProduct) {
        this.creditProduct = creditProduct;
    }

    public Simulation creditProduct(CreditProduct creditProduct) {
        this.setCreditProduct(creditProduct);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Simulation)) {
            return false;
        }
        return id != null && id.equals(((Simulation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Simulation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
