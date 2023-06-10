package com.bnppf.alphacredit.creditproductdesigner.repository;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRuleCondition;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB reactive repository for the BusinessRuleCondition entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessRuleConditionRepository extends ReactiveMongoRepository<BusinessRuleCondition, String> {}
