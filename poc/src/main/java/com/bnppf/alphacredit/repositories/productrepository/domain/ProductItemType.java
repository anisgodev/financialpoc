package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemCategoryEnum;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.StateEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ProductItemType.
 */
@Entity
@Table(name = "product_item_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductItemType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_item_category")
    private ProductItemCategoryEnum productItemCategory;

    @Column(name = "type_name")
    private String typeName;

    @Enumerated(EnumType.STRING)
    @Column(name = "state_enum")
    private StateEnum stateEnum;

    @OneToMany(mappedBy = "productItemType")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "eligibilityConditions", "itemFeatures", "productItemType" }, allowSetters = true)
    private Set<ProductRepositoryItem> productRepositoryItems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProductItemType id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductItemCategoryEnum getProductItemCategory() {
        return this.productItemCategory;
    }

    public ProductItemType productItemCategory(ProductItemCategoryEnum productItemCategory) {
        this.setProductItemCategory(productItemCategory);
        return this;
    }

    public void setProductItemCategory(ProductItemCategoryEnum productItemCategory) {
        this.productItemCategory = productItemCategory;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public ProductItemType typeName(String typeName) {
        this.setTypeName(typeName);
        return this;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public StateEnum getStateEnum() {
        return this.stateEnum;
    }

    public ProductItemType stateEnum(StateEnum stateEnum) {
        this.setStateEnum(stateEnum);
        return this;
    }

    public void setStateEnum(StateEnum stateEnum) {
        this.stateEnum = stateEnum;
    }

    public Set<ProductRepositoryItem> getProductRepositoryItems() {
        return this.productRepositoryItems;
    }

    public void setProductRepositoryItems(Set<ProductRepositoryItem> productRepositoryItems) {
        if (this.productRepositoryItems != null) {
            this.productRepositoryItems.forEach(i -> i.setProductItemType(null));
        }
        if (productRepositoryItems != null) {
            productRepositoryItems.forEach(i -> i.setProductItemType(this));
        }
        this.productRepositoryItems = productRepositoryItems;
    }

    public ProductItemType productRepositoryItems(Set<ProductRepositoryItem> productRepositoryItems) {
        this.setProductRepositoryItems(productRepositoryItems);
        return this;
    }

    public ProductItemType addProductRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.productRepositoryItems.add(productRepositoryItem);
        productRepositoryItem.setProductItemType(this);
        return this;
    }

    public ProductItemType removeProductRepositoryItem(ProductRepositoryItem productRepositoryItem) {
        this.productRepositoryItems.remove(productRepositoryItem);
        productRepositoryItem.setProductItemType(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProductItemType)) {
            return false;
        }
        return id != null && id.equals(((ProductItemType) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductItemType{" +
            "id=" + getId() +
            ", productItemCategory='" + getProductItemCategory() + "'" +
            ", typeName='" + getTypeName() + "'" +
            ", stateEnum='" + getStateEnum() + "'" +
            "}";
    }
}
