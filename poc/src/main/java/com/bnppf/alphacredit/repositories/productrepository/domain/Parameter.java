package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterStateEnum;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterTypeEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Parameter.
 */
@Entity
@Table(name = "parameter")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Parameter implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ParameterTypeEnum type;

    @Enumerated(EnumType.STRING)
    @Column(name = "parameter_state_enum")
    private ParameterStateEnum parameterStateEnum;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters" }, allowSetters = true)
    private ParameterDefType parameterDefType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters" }, allowSetters = true)
    private ExpectedValue expectedValue;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters", "eligibilityConditions", "productRepositoryItem" }, allowSetters = true)
    private ItemFeature itemFeature;

    @OneToMany(mappedBy = "parameter")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parameter", "eligibilityConditions" }, allowSetters = true)
    private Set<Condition> conditions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parameter id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParameterTypeEnum getType() {
        return this.type;
    }

    public Parameter type(ParameterTypeEnum type) {
        this.setType(type);
        return this;
    }

    public void setType(ParameterTypeEnum type) {
        this.type = type;
    }

    public ParameterStateEnum getParameterStateEnum() {
        return this.parameterStateEnum;
    }

    public Parameter parameterStateEnum(ParameterStateEnum parameterStateEnum) {
        this.setParameterStateEnum(parameterStateEnum);
        return this;
    }

    public void setParameterStateEnum(ParameterStateEnum parameterStateEnum) {
        this.parameterStateEnum = parameterStateEnum;
    }

    public ParameterDefType getParameterDefType() {
        return this.parameterDefType;
    }

    public void setParameterDefType(ParameterDefType parameterDefType) {
        this.parameterDefType = parameterDefType;
    }

    public Parameter parameterDefType(ParameterDefType parameterDefType) {
        this.setParameterDefType(parameterDefType);
        return this;
    }

    public ExpectedValue getExpectedValue() {
        return this.expectedValue;
    }

    public void setExpectedValue(ExpectedValue expectedValue) {
        this.expectedValue = expectedValue;
    }

    public Parameter expectedValue(ExpectedValue expectedValue) {
        this.setExpectedValue(expectedValue);
        return this;
    }

    public ItemFeature getItemFeature() {
        return this.itemFeature;
    }

    public void setItemFeature(ItemFeature itemFeature) {
        this.itemFeature = itemFeature;
    }

    public Parameter itemFeature(ItemFeature itemFeature) {
        this.setItemFeature(itemFeature);
        return this;
    }

    public Set<Condition> getConditions() {
        return this.conditions;
    }

    public void setConditions(Set<Condition> conditions) {
        if (this.conditions != null) {
            this.conditions.forEach(i -> i.setParameter(null));
        }
        if (conditions != null) {
            conditions.forEach(i -> i.setParameter(this));
        }
        this.conditions = conditions;
    }

    public Parameter conditions(Set<Condition> conditions) {
        this.setConditions(conditions);
        return this;
    }

    public Parameter addCondition(Condition condition) {
        this.conditions.add(condition);
        condition.setParameter(this);
        return this;
    }

    public Parameter removeCondition(Condition condition) {
        this.conditions.remove(condition);
        condition.setParameter(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parameter)) {
            return false;
        }
        return id != null && id.equals(((Parameter) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parameter{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", parameterStateEnum='" + getParameterStateEnum() + "'" +
            "}";
    }
}
