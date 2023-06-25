package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemFeature entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemFeatureRepository extends JpaRepository<ItemFeature, Long> {}
