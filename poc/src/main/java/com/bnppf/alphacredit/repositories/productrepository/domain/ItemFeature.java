package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemFeature.
 */
@Entity
@Table(name = "item_feature")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemFeature implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "feature_name")
    private String featureName;

    @Column(name = "feature_label")
    private String featureLabel;

    @OneToMany(mappedBy = "itemFeature")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parameterDefType", "expectedValue", "itemFeature", "conditions" }, allowSetters = true)
    private Set<Parameter> parameters = new HashSet<>();

    @OneToMany(mappedBy = "itemFeature")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "condition", "itemFeature", "productRepositoryItem", "itemGroup" }, allowSetters = true)
    private Set<EligibilityCondition> eligibilityConditions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "eligibilityConditions", "itemFeatures", "productItemType" }, allowSetters = true)
    private ProductRepositoryItem productRepositoryItem;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemFeature id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeatureName() {
        return this.featureName;
    }

    public ItemFeature featureName(String featureName) {
        this.setFeatureName(featureName);
        return this;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getFeatureLabel() {
        return this.featureLabel;
    }

    public ItemFeature featureLabel(String featureLabel) {
        this.setFeatureLabel(featureLabel);
        return this;
    }

    public void setFeatureLabel(String featureLabel) {
        this.featureLabel = featureLabel;
    }

    public Set<Parameter> getParameters() {
        return this.parameters;
    }

    public void setParameters(Set<Parameter> parameters) {
        if (this.parameters != null) {
            this.parameters.forEach(i -> i.setItemFeature(null));
        }
        if (parameters != null) {
            parameters.forEach(i -> i.setItemFeature(this));
        }
        this.parameters = parameters;
    }

    public ItemFeature parameters(Set<Parameter> parameters) {
        this.setParameters(parameters);
        return this;
    }

    public ItemFeature addParameter(Parameter parameter) {
        this.parameters.add(parameter);
        parameter.setItemFeature(this);
        return this;
    }

    public ItemFeature removeParameter(Parameter parameter) {
        this.parameters.remove(parameter);
        parameter.setItemFeature(null);
        return this;
    }

    public Set<EligibilityCondition> getEligibilityConditions() {
        return this.eligibilityConditions;
    }

    public void setEligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        if (this.eligibilityConditions != null) {
            this.eligibilityConditions.forEach(i -> i.setItemFeature(null));
        }
        if (eligibilityConditions != null) {
            eligibilityConditions.forEach(i -> i.setItemFeature(this));
        }
        this.eligibilityConditions = eligibilityConditions;
    }

    public ItemFeature eligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        this.setEligibilityConditions(eligibilityConditions);
        return this;
    }

    public ItemFeature addEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.add(eligibilityCondition);
        eligibilityCondition.setItemFeature(this);
        return this;
    }

    public ItemFeature removeEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.remove(eligibilityCondition);
        eligibilityCondition.setItemFeature(null);
        return this;
    }

    public ProductRepositoryItem getProductRepositoryItem() {
        return this.productRepositoryItem;
    }

    public void setProductRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.productRepositoryItem = productRepositoryItem;
    }

    public ItemFeature productRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.setProductRepositoryItem(productRepositoryItem);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemFeature)) {
            return false;
        }
        return id != null && id.equals(((ItemFeature) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemFeature{" +
            "id=" + getId() +
            ", featureName='" + getFeatureName() + "'" +
            ", featureLabel='" + getFeatureLabel() + "'" +
            "}";
    }
}
