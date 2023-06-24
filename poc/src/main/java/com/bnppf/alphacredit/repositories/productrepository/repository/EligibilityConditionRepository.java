package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.EligibilityCondition;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EligibilityCondition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EligibilityConditionRepository extends JpaRepository<EligibilityCondition, Long> {}
