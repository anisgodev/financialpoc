package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductItemType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductItemTypeRepository extends JpaRepository<ProductItemType, Long> {}
