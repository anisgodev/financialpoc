package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemCategoryEnum;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemStateEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductRepositoryItem.
 */
@Entity
@Table(name = "product_repository_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductRepositoryItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_item_category_enum")
    private ProductItemCategoryEnum productItemCategoryEnum;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_stage")
    private ProductItemStateEnum itemStage;

    @OneToMany(mappedBy = "productRepositoryItem")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "condition", "itemFeature", "productRepositoryItem", "itemGroup" }, allowSetters = true)
    private Set<EligibilityCondition> eligibilityConditions = new HashSet<>();

    @OneToMany(mappedBy = "productRepositoryItem")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parameters", "eligibilityConditions", "productRepositoryItem" }, allowSetters = true)
    private Set<ItemFeature> itemFeatures = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "productRepositoryItems" }, allowSetters = true)
    private ProductItemType productItemType;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductRepositoryItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ProductRepositoryItem name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public ProductRepositoryItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProductItemCategoryEnum getProductItemCategoryEnum() {
        return this.productItemCategoryEnum;
    }

    public ProductRepositoryItem productItemCategoryEnum(ProductItemCategoryEnum productItemCategoryEnum) {
        this.setProductItemCategoryEnum(productItemCategoryEnum);
        return this;
    }

    public void setProductItemCategoryEnum(ProductItemCategoryEnum productItemCategoryEnum) {
        this.productItemCategoryEnum = productItemCategoryEnum;
    }

    public ProductItemStateEnum getItemStage() {
        return this.itemStage;
    }

    public ProductRepositoryItem itemStage(ProductItemStateEnum itemStage) {
        this.setItemStage(itemStage);
        return this;
    }

    public void setItemStage(ProductItemStateEnum itemStage) {
        this.itemStage = itemStage;
    }

    public Set<EligibilityCondition> getEligibilityConditions() {
        return this.eligibilityConditions;
    }

    public void setEligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        if (this.eligibilityConditions != null) {
            this.eligibilityConditions.forEach(i -> i.setProductRepositoryItem(null));
        }
        if (eligibilityConditions != null) {
            eligibilityConditions.forEach(i -> i.setProductRepositoryItem(this));
        }
        this.eligibilityConditions = eligibilityConditions;
    }

    public ProductRepositoryItem eligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        this.setEligibilityConditions(eligibilityConditions);
        return this;
    }

    public ProductRepositoryItem addEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.add(eligibilityCondition);
        eligibilityCondition.setProductRepositoryItem(this);
        return this;
    }

    public ProductRepositoryItem removeEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.remove(eligibilityCondition);
        eligibilityCondition.setProductRepositoryItem(null);
        return this;
    }

    public Set<ItemFeature> getItemFeatures() {
        return this.itemFeatures;
    }

    public void setItemFeatures(Set<ItemFeature> itemFeatures) {
        if (this.itemFeatures != null) {
            this.itemFeatures.forEach(i -> i.setProductRepositoryItem(null));
        }
        if (itemFeatures != null) {
            itemFeatures.forEach(i -> i.setProductRepositoryItem(this));
        }
        this.itemFeatures = itemFeatures;
    }

    public ProductRepositoryItem itemFeatures(Set<ItemFeature> itemFeatures) {
        this.setItemFeatures(itemFeatures);
        return this;
    }

    public ProductRepositoryItem addItemFeature(ItemFeature itemFeature) {
        this.itemFeatures.add(itemFeature);
        itemFeature.setProductRepositoryItem(this);
        return this;
    }

    public ProductRepositoryItem removeItemFeature(ItemFeature itemFeature) {
        this.itemFeatures.remove(itemFeature);
        itemFeature.setProductRepositoryItem(null);
        return this;
    }

    public ProductItemType getProductItemType() {
        return this.productItemType;
    }

    public void setProductItemType(ProductItemType productItemType) {
        this.productItemType = productItemType;
    }

    public ProductRepositoryItem productItemType(ProductItemType productItemType) {
        this.setProductItemType(productItemType);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductRepositoryItem)) {
            return false;
        }
        return id != null && id.equals(((ProductRepositoryItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductRepositoryItem{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", productItemCategoryEnum='" + getProductItemCategoryEnum() + "'" +
            ", itemStage='" + getItemStage() + "'" +
            "}";
    }
}
