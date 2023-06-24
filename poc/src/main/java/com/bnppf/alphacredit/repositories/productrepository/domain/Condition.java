package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Condition.
 */
@Entity
@Table(name = "condition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Condition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "operator")
    private String operator;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameterDefType", "expectedValue", "itemFeature", "conditions" }, allowSetters = true)
    private Parameter parameter;

    @OneToMany(mappedBy = "condition")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "condition", "itemFeature", "productRepositoryItem", "itemGroup" }, allowSetters = true)
    private Set<EligibilityCondition> eligibilityConditions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Condition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOperator() {
        return this.operator;
    }

    public Condition operator(String operator) {
        this.setOperator(operator);
        return this;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Parameter getParameter() {
        return this.parameter;
    }

    public void setParameter(Parameter parameter) {
        this.parameter = parameter;
    }

    public Condition parameter(Parameter parameter) {
        this.setParameter(parameter);
        return this;
    }

    public Set<EligibilityCondition> getEligibilityConditions() {
        return this.eligibilityConditions;
    }

    public void setEligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        if (this.eligibilityConditions != null) {
            this.eligibilityConditions.forEach(i -> i.setCondition(null));
        }
        if (eligibilityConditions != null) {
            eligibilityConditions.forEach(i -> i.setCondition(this));
        }
        this.eligibilityConditions = eligibilityConditions;
    }

    public Condition eligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        this.setEligibilityConditions(eligibilityConditions);
        return this;
    }

    public Condition addEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.add(eligibilityCondition);
        eligibilityCondition.setCondition(this);
        return this;
    }

    public Condition removeEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.remove(eligibilityCondition);
        eligibilityCondition.setCondition(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Condition)) {
            return false;
        }
        return id != null && id.equals(((Condition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Condition{" +
            "id=" + getId() +
            ", operator='" + getOperator() + "'" +
            "}";
    }
}
