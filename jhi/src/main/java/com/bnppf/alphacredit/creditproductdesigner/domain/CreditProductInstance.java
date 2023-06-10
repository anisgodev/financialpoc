package com.bnppf.alphacredit.creditproductdesigner.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A CreditProductInstance.
 */
@Document(collection = "credit_product_instance")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CreditProductInstance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull(message = "must not be null")
    @Field("name")
    private String name;

    @Field("simulations")
    @JsonIgnoreProperties(value = { "creditProduct" }, allowSetters = true)
    private Simulation simulations;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public CreditProductInstance id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CreditProductInstance name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Simulation getSimulations() {
        return this.simulations;
    }

    public void setSimulations(Simulation simulation) {
        this.simulations = simulation;
    }

    public CreditProductInstance simulations(Simulation simulation) {
        this.setSimulations(simulation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CreditProductInstance)) {
            return false;
        }
        return id != null && id.equals(((CreditProductInstance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CreditProductInstance{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
