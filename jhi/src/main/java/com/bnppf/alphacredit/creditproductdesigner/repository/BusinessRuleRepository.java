package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRule;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the BusinessRule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessRuleRepository extends ReactiveMongoRepository<BusinessRule, String> {}
