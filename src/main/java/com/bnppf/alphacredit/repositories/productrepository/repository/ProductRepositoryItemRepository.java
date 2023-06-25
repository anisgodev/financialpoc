package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ProductRepositoryItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepositoryItemRepository extends JpaRepository<ProductRepositoryItem, Long> {}
