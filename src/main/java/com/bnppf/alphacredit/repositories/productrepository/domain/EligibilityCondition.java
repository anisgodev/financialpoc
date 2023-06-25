package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ApplyLevelEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EligibilityCondition.
 */
@Entity
@Table(name = "eligibility_condition")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EligibilityCondition implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "apply_level_enum")
    private ApplyLevelEnum applyLevelEnum;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameter", "eligibilityConditions" }, allowSetters = true)
    private Condition condition;

    @ManyToOne
    @JsonIgnoreProperties(value = { "parameters", "eligibilityConditions", "productRepositoryItem" }, allowSetters = true)
    private ItemFeature itemFeature;

    @ManyToOne
    @JsonIgnoreProperties(value = { "eligibilityConditions", "itemFeatures", "productItemType" }, allowSetters = true)
    private ProductRepositoryItem productRepositoryItem;

    @ManyToOne
    @JsonIgnoreProperties(value = { "eligibilityConditions" }, allowSetters = true)
    private ItemGroup itemGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EligibilityCondition id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ApplyLevelEnum getApplyLevelEnum() {
        return this.applyLevelEnum;
    }

    public EligibilityCondition applyLevelEnum(ApplyLevelEnum applyLevelEnum) {
        this.setApplyLevelEnum(applyLevelEnum);
        return this;
    }

    public void setApplyLevelEnum(ApplyLevelEnum applyLevelEnum) {
        this.applyLevelEnum = applyLevelEnum;
    }

    public Condition getCondition() {
        return this.condition;
    }

    public void setCondition(Condition condition) {
        this.condition = condition;
    }

    public EligibilityCondition condition(Condition condition) {
        this.setCondition(condition);
        return this;
    }

    public ItemFeature getItemFeature() {
        return this.itemFeature;
    }

    public void setItemFeature(ItemFeature itemFeature) {
        this.itemFeature = itemFeature;
    }

    public EligibilityCondition itemFeature(ItemFeature itemFeature) {
        this.setItemFeature(itemFeature);
        return this;
    }

    public ProductRepositoryItem getProductRepositoryItem() {
        return this.productRepositoryItem;
    }

    public void setProductRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.productRepositoryItem = productRepositoryItem;
    }

    public EligibilityCondition productRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.setProductRepositoryItem(productRepositoryItem);
        return this;
    }

    public ItemGroup getItemGroup() {
        return this.itemGroup;
    }

    public void setItemGroup(ItemGroup itemGroup) {
        this.itemGroup = itemGroup;
    }

    public EligibilityCondition itemGroup(ItemGroup itemGroup) {
        this.setItemGroup(itemGroup);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EligibilityCondition)) {
            return false;
        }
        return id != null && id.equals(((EligibilityCondition) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EligibilityCondition{" +
            "id=" + getId() +
            ", applyLevelEnum='" + getApplyLevelEnum() + "'" +
            "}";
    }
}
