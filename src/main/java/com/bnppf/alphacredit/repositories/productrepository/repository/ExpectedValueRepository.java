package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ExpectedValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExpectedValueRepository extends JpaRepository<ExpectedValue, Long> {}
