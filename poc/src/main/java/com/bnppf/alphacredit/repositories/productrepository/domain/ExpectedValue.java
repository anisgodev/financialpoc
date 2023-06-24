package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterTypeEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExpectedValue.
 */
@Entity
@Table(name = "expected_value")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ExpectedValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "parameter_type_enum")
    private ParameterTypeEnum parameterTypeEnum;

    @Column(name = "value")
    private String value;

    @OneToMany(mappedBy = "expectedValue")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parameterDefType", "expectedValue", "itemFeature", "conditions" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExpectedValue id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParameterTypeEnum getParameterTypeEnum() {
        return this.parameterTypeEnum;
    }

    public ExpectedValue parameterTypeEnum(ParameterTypeEnum parameterTypeEnum) {
        this.setParameterTypeEnum(parameterTypeEnum);
        return this;
    }

    public void setParameterTypeEnum(ParameterTypeEnum parameterTypeEnum) {
        this.parameterTypeEnum = parameterTypeEnum;
    }

    public String getValue() {
        return this.value;
    }

    public ExpectedValue value(String value) {
        this.setValue(value);
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setExpectedValue(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setExpectedValue(this));
        }
        this.parameters = parameters;
    }

    public ExpectedValue parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public ExpectedValue addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setExpectedValue(this);
        return this;
    }

    public ExpectedValue removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setExpectedValue(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExpectedValue)) {
            return false;
        }
        return id != null && id.equals(((ExpectedValue) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExpectedValue{" +
            "id=" + getId() +
            ", parameterTypeEnum='" + getParameterTypeEnum() + "'" +
            ", value='" + getValue() + "'" +
            "}";
    }
}
