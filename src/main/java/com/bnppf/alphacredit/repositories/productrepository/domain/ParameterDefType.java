package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterGroupEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ParameterDefType.
 */
@Entity
@Table(name = "parameter_def_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParameterDefType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "field_name")
    private String fieldName;

    @Column(name = "label")
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(name = "parameter_group_enum")
    private ParameterGroupEnum parameterGroupEnum;

    @OneToMany(mappedBy = "parameterDefType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parameterDefType", "expectedValue", "itemFeature", "conditions" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ParameterDefType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public ParameterDefType fieldName(String fieldName) {
        this.setFieldName(fieldName);
        return this;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getLabel() {
        return this.label;
    }

    public ParameterDefType label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public ParameterGroupEnum getParameterGroupEnum() {
        return this.parameterGroupEnum;
    }

    public ParameterDefType parameterGroupEnum(ParameterGroupEnum parameterGroupEnum) {
        this.setParameterGroupEnum(parameterGroupEnum);
        return this;
    }

    public void setParameterGroupEnum(ParameterGroupEnum parameterGroupEnum) {
        this.parameterGroupEnum = parameterGroupEnum;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setParameterDefType(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setParameterDefType(this));
        }
        this.parameters = parameters;
    }

    public ParameterDefType parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public ParameterDefType addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setParameterDefType(this);
        return this;
    }

    public ParameterDefType removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setParameterDefType(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParameterDefType)) {
            return false;
        }
        return id != null && id.equals(((ParameterDefType) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParameterDefType{" +
            "id=" + getId() +
            ", fieldName='" + getFieldName() + "'" +
            ", label='" + getLabel() + "'" +
            ", parameterGroupEnum='" + getParameterGroupEnum() + "'" +
            "}";
    }
}
