package com.bnppf.alphacredit.repositories.productrepository.repository;

import com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ParameterDefType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParameterDefTypeRepository extends JpaRepository<ParameterDefType, Long> {}
