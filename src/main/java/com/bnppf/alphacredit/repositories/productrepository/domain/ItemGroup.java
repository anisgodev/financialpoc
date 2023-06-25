package com.bnppf.alphacredit.repositories.productrepository.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemGroup.
 */
@Entity
@Table(name = "item_group")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "item_group_name")
    private String itemGroupName;

    @Column(name = "item_group_description")
    private String itemGroupDescription;

    @OneToMany(mappedBy = "itemGroup")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "condition", "itemFeature", "productRepositoryItem", "itemGroup" }, allowSetters = true)
    private Set<EligibilityCondition> eligibilityConditions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemGroup id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getItemGroupName() {
        return this.itemGroupName;
    }

    public ItemGroup itemGroupName(String itemGroupName) {
        this.setItemGroupName(itemGroupName);
        return this;
    }

    public void setItemGroupName(String itemGroupName) {
        this.itemGroupName = itemGroupName;
    }

    public String getItemGroupDescription() {
        return this.itemGroupDescription;
    }

    public ItemGroup itemGroupDescription(String itemGroupDescription) {
        this.setItemGroupDescription(itemGroupDescription);
        return this;
    }

    public void setItemGroupDescription(String itemGroupDescription) {
        this.itemGroupDescription = itemGroupDescription;
    }

    public Set<EligibilityCondition> getEligibilityConditions() {
        return this.eligibilityConditions;
    }

    public void setEligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        if (this.eligibilityConditions != null) {
            this.eligibilityConditions.forEach(i -> i.setItemGroup(null));
        }
        if (eligibilityConditions != null) {
            eligibilityConditions.forEach(i -> i.setItemGroup(this));
        }
        this.eligibilityConditions = eligibilityConditions;
    }

    public ItemGroup eligibilityConditions(Set<EligibilityCondition> eligibilityConditions) {
        this.setEligibilityConditions(eligibilityConditions);
        return this;
    }

    public ItemGroup addEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.add(eligibilityCondition);
        eligibilityCondition.setItemGroup(this);
        return this;
    }

    public ItemGroup removeEligibilityCondition(EligibilityCondition eligibilityCondition) {
        this.eligibilityConditions.remove(eligibilityCondition);
        eligibilityCondition.setItemGroup(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemGroup)) {
            return false;
        }
        return id != null && id.equals(((ItemGroup) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemGroup{" +
            "id=" + getId() +
            ", itemGroupName='" + getItemGroupName() + "'" +
            ", itemGroupDescription='" + getItemGroupDescription() + "'" +
            "}";
    }
}
